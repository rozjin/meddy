import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { prisma } from "@/meddy/app/api/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/meddy/hooks/auth";

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

                is_renew: true,
                next_renewal: true,

                quantity: true,
                filled: true,
                note: true,
              
                unit: true,
                is_packs: true,
                
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