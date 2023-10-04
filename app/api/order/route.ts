import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { prisma } from "@/meddy/app/api/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/meddy/hooks/auth";
import { zfd } from "zod-form-data";
import { generate } from "randomstring";
import { z } from "zod";
import { OrderProgress } from "@prisma/client";

const schema = zfd.formData({
    ids: zfd.text().array(),
    deliverBy: zfd.text()
})

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
            address: true
        }
    })

    const data = schema.parse(await req.formData());
    const { ids, deliverBy } = data

    try {
        const today = new Date()
        await prisma.order.create({
            data: {
                friendly_id: generate({
                    length: 12,
                    capitalization: 'uppercase'
                }),

                delivered: today,
                deliver_by: new Date(deliverBy),
                progress: OrderProgress.PREPARING,

                address: user!.address!,
                medicines: {
                    connect: ids.map(id => ({ friendly_id: id }))
                },

                patient: {
                    connect: {
                        user_id: userId
                    }
                }
            }
        })

        return NextResponse.json(
            { message: "Success! Your order has been placed. A pharmacist will review it shortly" }
        )
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
        const orders = await prisma.order.findMany({
            where: {
                patient: {
                    user_id: userId
                }
            },

            select: {
                friendly_id: true,
                
                created: true,
                delivered: true,
                deliver_by: true,

                ask_consult: true,
                is_consult: true,

                progress: true,

                address: true,
                
                medicines: {
                    select: {
                        name: true,

                        cur_renew: true,
                        num_renew: true
                    }
                }
            }
        })

        return NextResponse.json({
            orders
        })
    } catch (err) {
        console.log(`Unknown error: ${err}`)
    }

    return NextResponse.json(
        { message: "An unknown server error occured"},
    { status: 500 })
}