import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { prisma } from "@/meddy/app/api/prisma";

import { default as argon2 } from "argon2";
import { generate } from "randomstring";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const schema = zfd.formData({
    name: zfd.text().refine(n => n.length > 2 && n.length < 64),
    email: z.string().email(),

    password: zfd.text().refine(p => p.length > 8 && p.length < 64)
})
export const POST = async (req: NextRequest) => {
    const { name, email, password } = schema.parse(await req.formData())

    try {
        await prisma.user.create({
            data: {
                email: email,
                name: name,

                password: await argon2.hash(password, {
                    memoryCost: 2048
                }),

                patient: {
                    create: {
                        friendly_id: generate({
                            length: 12,
                            capitalization: 'uppercase'
                        })
                    }
                }
            }
        })

        return NextResponse.json(
            { message: "A link to activate your account has been sent to the email provided." }
        )
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError && err.code == "P2002") {
            return NextResponse.json(
                { message: "A link to activate your account has been sent to the email provided." }
            )    
        }
        console.error(err);
    }

    return NextResponse.json(
        { message: "An unknown server error occured" },
    { status: 500 })
}