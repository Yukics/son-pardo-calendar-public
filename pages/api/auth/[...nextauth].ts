import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Email from "next-auth/providers/email";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

//Init db connection
const prisma = new PrismaClient()

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {


    // if (req.query.nextauth.includes("callback") && req.method === "POST") {
    //     console.log(
    //         "Handling callback request from my Identity Provider",
    //         req.body
    //     )
    // }

    // Get a custom cookie value from the request
    // const someCookie = req.cookies["some-custom-cookie"]

    const whiteListArr = await getWhitelist()
    
    return await NextAuth(req, res, {

        providers: [
            Email({
                server: {
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT),
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASSWORD,
                    },
                },
                from: process.env.SMTP_FROM, // The "from" address that you want to use
                whitelist: whiteListArr
            }),
        ],
        adapter: PrismaAdapter(prisma),
        secret: process.env.SECRET,
        session: {
            strategy: "database",
            maxAge: 30 * 24 * 60 * 60, // 30 days
            updateAge: 24 * 60 * 60, // 24 hours
        },
        debug: true,
        // pages: {
        //     signIn: '/auth/signin',
        //     signOut: '/auth/signout',
        //     error: '/auth/error', // Error code passed in query string as ?error=
        //     verifyRequest: '/auth/verify-request', // (used for check email message)
        //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
        // },
        callbacks: {
            session({ session, token }) {
                // Return a cookie value as part of the session
                // This is read when `req.query.nextauth.includes("session") && req.method === "GET"`
                // session.someCookie = someCookie
                return session
            }
        }
    })
}

async function getWhitelist(){

    await prisma.$connect()
    const whiteData = await prisma.whitelist.findMany({})

    let whiteRes = []

    for (const whitelist of whiteData) {
        whiteRes.push(whitelist.email)
    }

    return whiteRes
}


