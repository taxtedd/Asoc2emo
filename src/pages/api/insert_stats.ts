// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {prisma} from "@/lib/prisma";
import {Node} from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {body, method} = req;
    console.log(method);
    console.log(body);
    if (method === "POST"){
        try{
            const data = body.data as Array<Array<string>>
            const len = data[0].length;
            const names = new Set<string>();
            for (let i = 0; i < data.length; i ++){
                for (let j = 0; j < data[i].length; j ++){
                    names.add(data[i][j]);
                }
            }
            for (const name of Array.from(names.values())) {
               const node = await prisma.node.findUnique({
                    where: {
                        name: name,
                    }
                });
               if (node === null){
                   await prisma.node.create({
                       data: {
                           name: name,
                       }
                   });
               }
            }
            for (let i = 0; i < len; i ++){
                const firstNode = await prisma.node.findUnique({
                    where: {
                        name: data[0][i],
                    }
                });
                for (let j = 1; j < data.length; j ++){
                    if (data[j][i] === data[0][i]) continue;
                    const secondNode = await prisma.node.findUnique({
                        where: {
                            name: data[j][i],
                        }
                    });
                    const cnt1 = await prisma.edge.count({
                        where: {
                            fromNodeId: (firstNode as Node).id,
                            toNodeId: (secondNode as Node).id,
                        }
                    });
                    const cnt2 = await prisma.edge.count({
                        where: {
                            toNodeId: (firstNode as Node).id,
                            fromNodeId: (secondNode as Node).id,
                        }
                    });
                    if (cnt1 > 0 || cnt2 > 0) continue;
                    await prisma.edge.create({
                        data: {
                            fromNodeId: (firstNode as Node).id,
                            toNodeId: (secondNode as Node).id
                        }
                    });
                }
            }
            res.status(200).json({})

        }
        catch (e) {
            console.log(e);
            res.status(500).json({error: (e as Error).message});
        }
        return;
    }
    res.status(404).json({});
}
