import {
    Box,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    Stepper,
    StepSeparator,
    StepStatus,
    StepTitle,
} from '@chakra-ui/react'


export function Indicator({activeStep, steps}: { activeStep: number, steps: Array<any> }) {


    return (
        <Stepper index={activeStep} minW="30%" maxW="500px">
            {steps.map((step, index) => (
                <Step key={index}>
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon/>}
                            incomplete={<StepNumber/>}
                            active={<StepNumber/>}
                        />
                    </StepIndicator>

                    <Box flexShrink='0'>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator/>
                </Step>
            ))}
        </Stepper>
    )
}