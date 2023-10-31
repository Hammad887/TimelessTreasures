import React, { useState } from "react";
import { Box, Input, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, ModalFooter } from "@chakra-ui/react";

import SelectConnections from "./SelectConnections"

const AddChat = ({ userUID, onAddChat }) => {
    const [selectedConnections, setSelectedConnections] = useState([]);
    const [selectedProfileNames, setSelectedProfileNames] = useState([]);

    const [chatName, setChatName] = useState("");

    const [errors, setErrors] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleAddChat = () => {
        let errorList = [];
        if (!chatName.trim() || selectedConnections.length < 1) {
            if (!chatName.trim()) {
                errorList.push("name");
            }

            if (selectedConnections.length < 1) {
                errorList.push("connections");
            }
            setErrors(errorList);

            return;
        }

        let combinedString = `${chatName} with ${selectedProfileNames.join(', ')}`;
        combinedString =  combinedString.slice(0, 100);

        onAddChat(selectedConnections, combinedString);
        setChatName("");
        setSelectedConnections([]);
        onClose();
    };
    
    return (
        <Box width={"100%"}>
            <Button width={"100%"} fontSize={"xl"} bg={"addButtonBG"} color={"addButtonText"} _hover={{ bg: "addButtonBGHover" }} alignSelf={"center"} onClick={onOpen}>Add Chat</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent pb={"10px"}>
                    <ModalHeader fontWeight={"bold"} fontSize={"2xl"} pb={'0px'} textAlign="center">Add Chat</ModalHeader>
                    <ModalBody align={"center"}>
                        <SelectConnections 
                            errors={errors} uid={userUID} 
                            selectedConnections={selectedConnections} 
                            setSelectedConnections={setSelectedConnections} 
                            selectedProfileNames={selectedProfileNames} 
                            setSelectedProfileNames={setSelectedProfileNames} 
                        />
                        {(errors.includes("name")) ?
                            <Text mt={3} fontSize="xl" mb={1} fontWeight="normal" color={"red"} textAlign={"center"} fontSize="xl">
                                Choose a name for your chat (required)
                            </Text>
                            :
                            <Text mt={3} fontSize="lg" mb={1} fontWeight="normal" color={"black"} textAlign={"center"} fontSize="xl">
                                Choose a name for your chat
                            </Text>
                        }
                        <Input
                            width={"100%"}
                            size={"lg"}
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                            placeholder={`Give your chatroom a name`}
                        />
                    </ModalBody>

                    <ModalFooter mb={2} width={"100%"} justifyContent={"center"}>
                        <Button fontSize={"xl"}  width={"100%"} colorScheme="blue" mr={2} onClick={handleAddChat}>
                            Create Chat
                        </Button>
                        <Button fontSize={"xl"}  width={"100%"} ml={2} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }}  onClick={() => onClose()}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AddChat;