import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
    useDisclosure
} from "@chakra-ui/react";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

import UserInfoForList from "./UserInfoForList";

const ConnectionsList = ({ uid }) => {
    const [connections, setConnections] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "users", uid), (doc) => {
            if (doc.exists()) {
                setConnections(doc.data().connections || []);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [uid]);

    return (
        <VStack textColor={"profileText"} alignItems="start" spacing={4}>
            
            <Text fontWeight={"semibold"} fontSize="lg">
                Connections:{" "}
                <Button color="white" bgColor={"connectionsButton"} size="sm" _hover={{ bg: "connectionsButtonHover" }} onClick={onOpen}>
                    {connections.length}
                </Button>
            </Text>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight={"bold"} fontSize={"2xl"} pb={'0px'} textAlign="center">Connections</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mb={2}>
                        <Flex flexDir={"column"} align={"center"}>
                            {connections.length ? (
                                connections.map((connection) => (
                                    <Box alignSelf={"center"} width={"85%"} pb={"0.6rem"}>
                                        <Box width={"100%"}>
                                        <UserInfoForList onClose={onClose} id={connection} />
                                        </Box>
                                    </Box>
                                ))
                            ) : (
                                <Text pb={"1rem"}>No connections found.</Text>
                            )}
                        </Flex>

                    </ModalBody>
                </ModalContent>
            </Modal>

        </VStack>
    );
};

export default ConnectionsList;