import {Header} from "@/components/Header";
import {Box} from "@chakra-ui/react";
import cytoscape from 'cytoscape'
import {useEffect, useRef} from "react";
import {prisma} from "@/lib/prisma";
import {Node} from "@prisma/client";

export default function Home({elements}: any) {
    const graphRef = useRef(null);

    const drawGraph = () => {
        const cy = cytoscape({
            container: graphRef.current,
            elements: elements,
            style: [{
                selector: '.hasLabel',
                css: {
                    'label': (ele: any) => {
                        if(ele.isNode()) return ele.data('id');
                    }
                }
            }],
        });
        cy.elements().toggleClass('hasLabel');
        const layout = cy.layout({
            'name': 'circle',
        });
        layout.run();
    }

    useEffect(() => {
        drawGraph();
    }, [elements])

    return (
        <>
            <Header/>
            <Box ref={graphRef} style={{width: '80%', height: '85vh', border: '1px solid grey', margin: '30px auto 0'}} id="cy" color="black">
            </Box>

        </>
    )
}

export async function getServerSideProps(context: any) {
    const id = parseInt(context.query.id);

    const elements: Array<any> = [];



    const edgesFromCurrent = await prisma.edge.findMany({
        where: {
            fromNodeId: id,
        }
    });
    const edgesToCurrent = await prisma.edge.findMany({
        where: {
            toNodeId: id,
        }
    });

    const edgesIds = new Set<number>();

    edgesFromCurrent.forEach((e: any) => {
        edgesIds.add(e.id);
    });
    edgesToCurrent.forEach((e: any) => {
        edgesIds.add(e.id);
    });

    const vertexIds = new Set<number>();
    for (const eId of Array.from(edgesIds)) {
        const edge = await prisma.edge.findUnique({where: {id: eId}});
        if (edge === null) continue;
        vertexIds.add(edge.toNodeId);
        vertexIds.add(edge.fromNodeId)
    }

    for (const vId of Array.from(vertexIds)){
        const edgesFromCurrent = await prisma.edge.findMany({
            where: {
                fromNodeId: vId,
            }
        });
        const edgesToCurrent = await prisma.edge.findMany({
            where: {
                toNodeId: vId,
            }
        });
        edgesFromCurrent.forEach((e: any) => {
            edgesIds.add(e.id);
        });
        edgesToCurrent.forEach((e: any) => {
            edgesIds.add(e.id);
        });
    }
    for (const eId of Array.from(edgesIds)) {
        const edge = await prisma.edge.findUnique({where: {id: eId}});
        if (edge === null) continue;
        vertexIds.add(edge.toNodeId);
        vertexIds.add(edge.fromNodeId)
    }

    for (const vId of Array.from(vertexIds)) {
        const node = await prisma.node.findUnique({
            where: {
                'id': vId
            }
        });
        if (node === null) continue;
        elements.push({
            data: {
                id: node.name,
            }
        });
    }

    for (const eId of Array.from(edgesIds)) {
        const edge = await prisma.edge.findUnique({
            where: {
                id: eId,
            }
        });
        if (edge === null) continue;
        const toNode = await prisma.node.findUnique({
            where: {
                id: edge.toNodeId,
            }
        });
        const fromNode = await prisma.node.findUnique({
            where: {
                id: edge.fromNodeId,
            }
        });
        if (toNode === null || fromNode === null) continue;
        elements.push({
            data: {
                id: 'edge' + edge.id,
                source: fromNode.name,
                target: toNode.name,
            }
        })
    }


    return {
        props: {
            elements
        }
    };
}