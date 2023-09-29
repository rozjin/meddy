import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { zfd } from "zod-form-data";
import { prisma } from "@/meddy/app/api/prisma";
import { generate } from "randomstring";
import { PrescriptionMethod, PrescriptionProgress } from "@prisma/client";

import * as mime from 'mime-types';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/meddy/hooks/auth";
import { s3 } from "@/meddy/app/api/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

const MAX_FILE_SIZE = 16000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const schema = zfd.formData({
    op: z.enum(["basic", "id", "nhi", "health"]),

    name: zfd.text().optional(),
    dob: z.string()
        .regex(new RegExp(/^(^0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4}$)$/))
        .transform(date => {
            const parts = date.split('/')
            return new Date(
                parseInt(parts[2], 10),
                parseInt(parts[1], 10) - 1,
                parseInt(parts[0], 10)
            );
        }).optional(),
    gender: zfd.text().optional(),
    phone_number: zfd.text().optional(),
    address: zfd.text().optional(),
    nhi: zfd.text().optional(),

    id: z
        .any()

        .refine((files) => files?.length >= 1, "Image is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        )

        .optional(),

    allergies: zfd.json(z.object({
        trigger: zfd.text(),
        condition: zfd.text()
    }).array()).optional(),

    otc: zfd.json(zfd.text().array()).optional()
})

const s3Base = process.env.AWS_URL as string
const s3Bucket = "IdentityImages"
export const POST = async (req: NextRequest, res: NextResponse) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { message: "Not logged in" },
        { status: 401 });
    }

    const userId = parseInt(session.user.id)
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },

        select: {
            name: true,
            dob: true,
            gender: true,
            phone_number: true,
            address: true,

            patient: {
                select: {
                    nhi: true,
                    allergies: true,
                    otc: true
                }
            }
        }
    })

    const data = schema.parse(await req.formData());
    const { op } = data;

    try {
        switch (op) {
            case "basic": {
                const { name, dob, gender, nhi, phone_number, address } = data;

                const isEmptyOrElse = <T>(original: T | undefined, replacement: T | undefined) => replacement ? replacement : original;
                await prisma.user.update({
                    where: {
                        id: userId
                    },

                    data: {
                        name: isEmptyOrElse(user?.name, name),
                        dob: isEmptyOrElse(user?.dob, dob),
                        gender: isEmptyOrElse(user?.gender, gender),
                        patient: {
                            update: {
                                data: {
                                    nhi: isEmptyOrElse(user?.patient?.nhi, nhi)
                                }
                            }
                        },
                        phone_number: isEmptyOrElse(user?.phone_number, phone_number),

                        address: isEmptyOrElse(user?.address, address)
                    }
                })

                return NextResponse.json(
                    { message: "Your user profile has been updated" }
                )
            }

            case "health": {
                const { otc, allergies } = data
                await prisma.patient.update({
                    where: {
                        user_id: userId
                    },

                    data: {
                        otc: otc,
                        allergies: {
                            deleteMany: {},
                            createMany: {
                                data: allergies?.map(item => ({ trigger: item.trigger, condition: item.condition })) || []
                            }
                        }
                    }
                })

                return NextResponse.json(
                    { message: "Your medical profile has been updated" }
                )
            }

            case "id": {
                const { id: files } = data

                if (files == undefined) {
                    return NextResponse.json(
                        { message: "Please attach an image to proceed" },
                    { status: 400 })
                }

                const pictures = await Promise.all(files?.map(async (file: File) => {
                    const path = `${generate({ length: 12, capitalization: 'uppercase' })}.${mime.extension(file.type)}`

                    await s3.send(new PutObjectCommand({
                        Bucket: s3Bucket,
                        Key: path,
                        Body: new Uint8Array(await file.arrayBuffer())
                    }))

                    return `${s3Base}/${s3Bucket}/${path}`
                }))

                await prisma.user.update({
                    where: {
                        id: userId
                    },

                    data: {
                        proof_id: pictures
                    }
                })

                return NextResponse.json(
                    { message: "Your proof of identity has been updated" }
                )
            }
        }
    } catch (err) {
        console.log(`Unknown error: ${err}`)
    }

    return NextResponse.json(
        { message: "An unknown server error occured"},
    { status: 500 })
}

export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { message: "Not logged in" },
        { status: 401 });
    }

    const userId = parseInt(session.user.id)

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },

            select: {
                name: true,
                dob: true,
                gender: true,

                phone_number: true,
                email: true,

                address: true,
                proof_id: true,

                patient: {
                    select: {
                        nhi: true,
                        allergies: true,
                        otc: true
                    }
                }
            }
        })

        return NextResponse.json({
            user
        })
    } catch (err) {
        console.log(`Unknown error: ${err}`)
    }

    return NextResponse.json(
        { message: "An unknown server error occured"},
    { status: 500 })
}