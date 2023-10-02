import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { prisma } from "@/meddy/app/api/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/meddy/hooks/auth";
import { zfd } from "zod-form-data";
import { generate } from "randomstring";
import { z } from "zod";

const schema = zfd.formData({
    op: z.enum(["repeat", "automatic"]),
    id: zfd.text()
})

export const POST = async (req: NextRequest, res: NextResponse) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { message: "Not logged in" },
        { status: 401 });
    }

    const userId = parseInt(session.user.id)

    const data = schema.parse(await req.formData());
    const { id, op } = data

    try {
        switch (op) {
            case "repeat": {
                await prisma.$transaction(async (ctx) => {
                    const medicine = await ctx.medicine.findUnique({
                        where: {
                            friendly_id: id
                        },

                        select: {
                            cur_renew: true,
                            num_renew: true
                        }
                    })

                    if (medicine!.cur_renew + 1 > medicine!.num_renew) {
                        return NextResponse.json(
                            { message: "Sorry, but that medicine has no repeats left. Please call your GP or message our pharmacist." },
                        { status: 400 })
                    }

                    await ctx.medicine.update({
                        where: {
                            friendly_id: id
                        },

                        data: {
                            repeats: {
                                create: [
                                    { friendly_id: generate({ length: 12, capitalization: 'uppercase' }), cur_renew: medicine!.cur_renew }
                                ]
                            }
                        }
                    })
                })

                return NextResponse.json(
                    { message: "Success! your request to use your repeat has been filed. A pharmacist will review it shortly" }
                )
            }

            case "automatic": {
                await prisma.$queryRaw`update "Medicine" set "is_automatic" = not "is_automatic" where "friendly_id" = ${id}`
                const medicine = await prisma.medicine.findUnique({
                    where: {
                        friendly_id: id
                    },

                    select: {
                        is_automatic: true
                    }
                })

                return NextResponse.json(
                    { message: medicine!.is_automatic ? "Success! your medicine will now automatically repeat" : "Success! your medicine will no longer automatically repeat" }
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
        const medicines = await prisma.medicine.findMany({
            where: {
                patient: {
                    user_id: userId
                }
            },

            select: {
                friendly_id: true,

                name: true,
                prescriber: true,

                cur_renew: true,
                num_renew: true,

                next_renewal: true,

                note: true,

                unit: true,
                is_packs: true,
                is_automatic: true,

                prescription: {
                    select: {
                        friendly_id: true
                    }
                },

                patient: {
                    select: {
                        friendly_id: true
                    }
                }
            }
        })

        return NextResponse.json({
            medicines
        })
    } catch (err) {
        console.log(`Unknown error: ${err}`)
    }

    return NextResponse.json(
        { message: "An unknown server error occured"},
    { status: 500 })
}