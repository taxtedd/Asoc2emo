import {useCallback, useMemo} from "react";
import {Box, Button, Center, CircularProgress, CircularProgressLabel, Text, useToast, VStack} from "@chakra-ui/react"
import axios from "axios";

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
import {associations} from "@/components/TestForCouples/TestBlock";

let isSame = [true];

const transpose = (matrix : Array<Array<any>>) => matrix[0].map((col, i) => matrix.map(row => row[i]));
export function ResultBlock({answers, name1, name2}: any) {
    const result = useMemo(() => {
        let ans: number = 0;
        let len: number = answers[0].length;

        isSame.pop();

        for (let i = 0; i < len; i++) {
            let isGood: boolean = true;

            answers[0][i] = answers[0][i].toLowerCase();
            answers[1][i] = answers[1][i].toLowerCase();
            if (answers[1][i] != answers[0][i]) {
                isGood = false;
                isSame[i] = false;
            } else {
                isSame[i] = true;
            }
            
            if (isGood) ans++;
        }
        return Math.round(ans / len * 100);
    }, [answers]);

    const toast = useToast()

    const sendData = useCallback(async () => {
        const response = await axios.post('/api/insert_stats', {
            data: answers,
        });
        if (response.status === 200){
            toast({
                title: 'Data sending is successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }
        else {
            toast({
                title: 'Error with data sending',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [answers, toast]);

    return <Box minW="50%" maxW="700px" padding="0 20px">
        <Text textAlign="center" fontWeight="bold" fontSize="18px" mt="10px">
            Your result is
        </Text>
        <VStack as={Center}>
            <CircularProgress value={result} size="100px" thickness="5px" color={result > 50 ? "green.400" : "blue"}>
                <CircularProgressLabel>{result}%</CircularProgressLabel>
            </CircularProgress>

            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Association</Th>
                            <Th>{name1}</Th>
                            <Th>{name2}</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {transpose(answers).map((ans: Array<string>, i: number) => {
                            return <Tr key={i}>
                                <Td>{associations[i]}</Td>
                                {ans.map((el: string, j: number) => {
                                    return <Td color={isSame[i] === true ? "green.400" : "red"} key={i * answers[0].length + j}>{el}</Td>
                                })}
                            </Tr>
                        })}
                    </Tbody>
                </Table>
            </TableContainer>

            <Button onClick={sendData}>
                Send data to statistic
            </Button>
        </VStack>


    </Box>
}