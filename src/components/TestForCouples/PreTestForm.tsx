import {Box, Button, Card, Input, VStack, Text} from "@chakra-ui/react";

export function PreTestForm({name1, setName1, name2, setName2, clickHandler}: any){
    return <Card minW="50%" maxW="700px" pb="20px">
    <VStack>
        <Text padding="10px" textAlign="center" fontWeight="500" fontSize="18px">
            Please fill the form before start quiz
        </Text>
        <Input type="text" value={name1} onChange={evt => setName1(evt.target.value)} placeholder="Please write gentleman's name"/>
        <Input type="text" value={name2} onChange={evt => setName2(evt.target.value)} placeholder="Please write lady's name"/>
        <Button onClick={clickHandler}>Continue</Button>
    </VStack> </Card>
}