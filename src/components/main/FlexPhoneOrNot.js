import { Flex, useMediaQuery } from "@chakra-ui/react";
import React from "react";

const FlexPhoneOrNot = ({ children }) => {

    const [isMobile] = useMediaQuery("(max-width: 600px)");

    return (
        <Flex minH={"100vh"} width={"100%"} flexDirection={isMobile ? "column" : "row"}>
            { children }
        </Flex>      
    );
};

export default FlexPhoneOrNot;