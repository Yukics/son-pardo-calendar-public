import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method, body } = req

    switch (method) {
        case "GET":
            try {
                const regsRes = await getRegs()

                res.status(200).send(regsRes);
            } catch (error: any) {
                res.status(500).send(error.message);
            }
            break;

        case "POST":
            try {

                const regsRes = await addReg(body)
                    .catch((e) => {
                        throw e
                    })
                    .finally(async () => {
                        await prisma.$disconnect()
                    })

                res.status(200).send({ success: regsRes });
            } catch (error: any) {
                res.status(500).send(error.message);
            }
            break;

        case "PUT":
            try {

                const regsRes = await updateName(body.email, body.name)
                    .catch((e) => {
                        throw e
                    })
                    .finally(async () => {
                        await prisma.$disconnect()
                    })

                res.status(200).send({ success: regsRes });
            } catch (error: any) {
                res.status(500).send(error.message);
            }
            break;

        case "DELETE":
            try {

                const regsRes = await delReg(body.id)
                    .catch((e) => {
                        throw e
                    })
                    .finally(async () => {
                        await prisma.$disconnect()
                    })

                res.status(200).send({ success: regsRes });
            } catch (error: any) {
                res.status(500).send(error.message);
            }
            break;

        default:
            res.status(404).send({ message: "Method not allowed" });
            break;
    }

}

async function getRegs() {
    await prisma.$connect()
    
    let day = new Date();
    day.setDate(day.getDate() - 1);
    const dayStr = day.toISOString()
    
    const regsData = await prisma.register.findMany({
        where: {
            date: {
                gt: dayStr
            }
        },
        orderBy: [
            {
                date: 'asc',
            },
            {
                inHour: 'asc',
            }
        ],
        include: {
            author: true,
        }
    })

    return regsData
}

async function addReg(input: any) {

    if (!validateInput(input)) {
        throw Error("Input is not valid")
    }

    await prisma.$connect()

    const user = await prisma.user.findUnique({
        where: {
            email: input.user,
        },
    }).catch((e) => {
        throw e
    }).finally(async () => {
        await prisma.$disconnect()
    })


    await prisma.register.create({
        data: {
            date: new Date(input.date),
            inHour: new Date(input.inHour),
            outHour: new Date(input.outHour),
            authorId: user?.id ? user.id : "",
            desc: input?.desc,
            note: input?.note ? input.note : null
        },
    }).catch((e) => {
        throw e
    }).finally(async () => {
        await prisma.$disconnect()
    })

    return true
}

async function updateName(mail: string, name: string) {
    await prisma.$connect()

    const updateUser = await prisma.user.update({
        where: {
            email: mail,
        },
        data: {
            name: name,
        },
    }).catch((e) => {
        throw e
    }).finally(async () => {
        await prisma.$disconnect()
    })

    return true
}

async function delReg(id: string) {
    await prisma.$connect()
    const deleteUser = await prisma.register.delete({
        where: {
            id: id,
        },
    }).catch((e) => {
        throw e
    }).finally(async () => {
        await prisma.$disconnect()
    })
    return true
}

function validateInput(input: any) {
    return true
}