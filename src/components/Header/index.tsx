import {HStack, Spacer} from "@chakra-ui/react";
import {Logo} from "@/components/Header/Logo";
import {Menu} from "@/components/Header/Menu";

export function Header() {
    return <HStack padding="0 10px" backgroundColor="#2A2C2F" height="60px" color="white">
        <Logo/>
        <Spacer/>
        <Menu/>
    </HStack>
}