import {Breadcrumb, BreadcrumbItem, Link} from "@chakra-ui/react";
import {linkHoverStyles} from "@/lib/styles";
import NextLink from 'next/link';

export function Menu() {
    return <Breadcrumb separator='-' fontSize="14px">
        <BreadcrumbItem>
            <Link as={NextLink} href='/' _hover={linkHoverStyles}>Test for Couples</Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
            <Link as={NextLink} href='/stats/' _hover={linkHoverStyles}>Statistics</Link>
        </BreadcrumbItem>
    </Breadcrumb>
}