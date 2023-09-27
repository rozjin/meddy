import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/meddy/app/api/prisma";

import { default as argon2 } from 'argon2'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }                
            },

            authorize: async (credentials) => {
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    },

                    select: {
                        id: true,
                        email: true,
                        name: true,

                        password: true
                    }
                })

                if (user) {
                    if (await argon2.verify(user.password, credentials?.password as string)) {
                        return {
                            id: `${user.id}`,
    
                            email: user.email,
                            name: user.name,
    
                            image: null
                        }   
                    }
                }

                return null
            }
        })
    ],

    session: {
        maxAge: 15 * 60
    },

    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.sub;
              }
              
              return session;
        }
    },

    pages: {
        signIn: "/auth",
        error: "/_error"
    }
}