import {Indicator} from "@/components/TestForCouples/Indicator";
import {Box, Center, useBoolean, useSteps, VStack} from "@chakra-ui/react";
import {TestBlock} from "@/components/TestForCouples/TestBlock";
import {useState} from "react";

const steps = [
    {title: 'Male', description: 'Test for gentleman'},
    {title: 'Female', description: 'Test for lady'},
]

export function TestForCouples() {
    const {activeStep, setActiveStep} = useSteps({
        index: 0,
        count: steps.length,
    });
    return <Center padding="20px 20px" as={VStack}>
        <Indicator activeStep={activeStep} steps={steps}/>
        <Box h="10px"></Box>
        <TestBlock step={activeStep} setStep={setActiveStep} maxStep={steps.length - 1}/>
    </Center>
}