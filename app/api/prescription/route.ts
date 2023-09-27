import { NextResponse } from "next/server";
import * as fs from 'node:fs';

import type { NextRequest } from "next/server";

import { zfd } from "zod-form-data";
import { z } from "zod";
import { prisma } from "@/meddy/app/api/prisma";
import { generate } from "randomstring";
import { PrescriptionMethod, PrescriptionProgress } from "@prisma/client";

import * as mime from 'mime-types';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/meddy/hooks/auth";
import { s3 } from "@/meddy/app/api/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const MAX_FILE_SIZE = 16000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const schema = zfd.formData({
    op: zfd.text().refine(o => o == "upload" || o == "transfer"),
    pharm: zfd.text().optional(),

    files: z
        .any()

        .refine((files) => files?.length >= 1, "Image is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        )

        .optional()
})

const s3Base = process.env.AWS_URL as string
const s3Bucket = "PrescriptionImages"
export const POST = async (req: NextRequest, res: NextResponse) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { message: "Not logged in" },
        { status: 401 });
    }

    const userId = parseInt(session.user.id)

    const data = schema.parse(await req.formData());
    const { op, pharm, files } = data;

    try {
        switch (op) {
            case "upload": {
                if (files == undefined) {
                    return NextResponse.json(
                        { message: "Please attach an image to proceed" },
                    { status: 400 })
                }

                const friendly_id = generate({
                    length: 12,
                    capitalization: 'uppercase'
                });

                const pictures = await Promise.all(files?.map(async (o) => {
                    const file = o as File

                    const name = `${generate({ length: 12, capitalization: 'uppercase' })}.${mime.extension(file.type)}`
                    const path = `${friendly_id}-${name}`

                    const url = await s3.send(new PutObjectCommand({
                        Bucket: s3Bucket,
                        Key: path,
                        Body: new Uint8Array(await file.arrayBuffer())
                    }))

                    return `${s3Base}/${s3Bucket}/${path}`
                }))

                await prisma.prescription.create({
                    data: {
                        friendly_id: friendly_id,

                        method: PrescriptionMethod.UPLOAD,
                        progress: PrescriptionProgress.REQUESTED,

                        pictures: pictures,

                        patient: {
                            connect: {
                                user_id: userId
                            }
                        }
                    }
                })

                return NextResponse.json(
                    { message: "Success! your prescription has been uploaded. A pharmacist will process it shortly" }
                )

                break;
            }

            case "transfer": {

                break;
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
        const prescriptions = await prisma.prescription.findMany({
            where: {
                patient: {
                    user_id: userId
                }
            },

            select: {
                friendly_id: true,
                created: true,
                
                progress: true,
                method: true,

                pictures: true,

                medicines: true
            }
        })

        return NextResponse.json({
            prescriptions
        })
    } catch (err) {
        console.log(`Unknown error: ${err}`)
    }

    return NextResponse.json(
        { message: "An unknown server error occured"},
    { status: 500 })
}