import {Header} from "@/components/Header";
import {Box, Button, HStack, Input, Select, Text, VStack, useToast} from "@chakra-ui/react";
import cytoscape from 'cytoscape'
import {useCallback, useEffect, useRef, useState} from "react";
import {prisma} from "@/lib/prisma";
import {Node} from "@prisma/client";
import {useRouter} from "next/router";

export default function Home({elements, nodes}: any) {
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
    }, [elements]);

    const router = useRouter();

    const [currentNode, setCurrentNode] = useState<any>(null);

    const toast = useToast();
    const onView = useCallback(async () => {
        if (currentNode) {
            toast({
                title: 'Wait, please',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            await router.push('/stats/' + currentNode.id); 
        } else {  
            toast({
                title: 'Graph does not include this word',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [router, currentNode]);

    const onSelect = useCallback((evt: any) => {
        const nodeName = evt.target.value.toLowerCase();
        const foundNode = nodes.find((node: any) => {
            return node.name === nodeName;
        });
        setCurrentNode(foundNode);
    }, [setCurrentNode])

    return (
        <>
            <Header/>
            <VStack pt="10px">
                <Text>Now you see full graph. If you want to see graph for special vertex choose it here. Graph will be drawn with depth 2.</Text>
                <Input onChange={onSelect} placeholder='Type the word you want to find' type="text" style={{width: '80%'}}></Input>
                <Button onClick={onView}>View new graph</Button>
            </VStack>
            <Box ref={graphRef} style={{margin:'10px auto 0', width: '80%', height: '70vh', border: '1px solid grey'}} id="cy" color="black">
            </Box>

        </>
    )
}

export async function getServerSideProps() {
    // const deleteNodes = await prisma.node.deleteMany();
    const nodes = await prisma.node.findMany();
    const elements = [];
    nodes.forEach((node: Node) => {
       elements.push({
           data: {
               id: node.name,
           }
       });
    });
    const edges = await prisma.edge.findMany({});
    for (const edge of edges) {
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
            elements, nodes
        }
    };
}