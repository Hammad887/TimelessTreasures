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

import UserInfoSelectConnections from "./UserInfoSelectConnections";

const ConnectionsList = ({ errors, uid, selectedConnections, setSelectedConnections, selectedProfileNames, setSelectedProfileNames }) => {
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

    const toggleConnection = (connectionID, pname) => {
        if (selectedConnections.includes(connectionID)) {
            setSelectedConnections(selectedConnections.filter((id) => id !== connectionID));
        } else {
            setSelectedConnections([...selectedConnections, connectionID]);
        }

        if (selectedProfileNames) {
            if (selectedProfileNames.includes(pname)) {
                setSelectedProfileNames(selectedProfileNames.filter((name) => name !== pname));
            } else {
                setSelectedProfileNames([...selectedProfileNames, pname]);
            }
        }
    };

    return (
        <VStack spacing={2}>
            {(errors.includes("connections")) ?
                <VStack spacing={0}>
                    <Text textAlign={"center"} fontWeight={"normal"} fontSize="xl">
                        Select people to add connections to the chat!
                    </Text>
                    <Text textColor={"red"} fontWeight={"normal"} textAlign={"center"} fontSize="xl">
                        (Please select at least 1 connection)
                    </Text>
                </VStack>
                :
                <Text textAlign={"center"} fontWeight={"normal"} fontSize="xl">
                    Select people to add connections to the chat!
                </Text>
            }
            <Box
                alignSelf="center"
                width="100%"
                maxHeight="280px"
                css={{
                    "&::-webkit-scrollbar": {
                        width: "12px",
                        backgroundColor: "#F5F5F5",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        borderRadius: "12px",
                        backgroundColor: "#888",
                    },
                }}
                overflowY="auto"
                px="3rem"
                py="0.5rem"
            >
                <Flex flexDir={"column"} align={"center"}>
                    {connections.length ? (
                        connections.map((connection) => (
                            <Box width={"100%"} alignSelf={"flex-start"} pb={"0.5rem"} key={connection}>
                                <UserInfoSelectConnections
                                    onClick={(pid, pname) => toggleConnection(connection, pname)}
                                    isSelected={selectedConnections.includes(connection)}
                                    onClose={onClose}
                                    id={connection}
                                />
                            </Box>
                        ))
                    ) : (
                        <Text pb={"1rem"}>No connections found.</Text>
                    )}
                </Flex>
            </Box>
        </VStack>
    );
};

export default ConnectionsList;