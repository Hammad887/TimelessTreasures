// AddRecipe.js

import React, { useEffect, useState } from "react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Text,
    FormControl,
    FormLabel,
    Input,
    ModalFooter,
    Button
} from "@chakra-ui/react";

import { useNavigate } from 'react-router-dom';

import { auth } from "../../../firebase.js";

const AddFamily = ({ addingFamily, setAddingFamily }) => {

    const [name, setName] = useState("");

    const handleAlertClose = () => {
        setAddingFamily(false);
    };

    return (
        <Modal isOpen={addingFamily} onClose={() => setAddingFamily(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontWeight={"bold"} fontSize={"2xl"} pb={'0px'} textAlign="center">Add As Family?</ModalHeader>

                <ModalBody>

                    <Text fontSize="18px" mt={0} textAlign={"center"} color={"red"} fontWeight="600"> 
                        *not fully implemented
                    </Text>

                    <Text fontSize="xl" mb={4} fontWeight="500">
                        You will have to wait for them accept your request to add.
                    </Text>

                    <FormControl>
                        <FormLabel fontSize="xl" mb={1} fontWeight="semibold">Write your relationship to them / Nickname</FormLabel>
                        <Input
                            value={name}
                            size={"lg"}
                            fontWeight={"normal"}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ex/ Nonna, Son, Jimmy"
                        />
                    </FormControl>

                </ModalBody>


                <ModalFooter mb={2} width={"100%"} justifyContent={"center"}>
                    <Button fontSize={"xl"} width={"100%"} colorScheme="blue" mr={2} onClick={() => setAddingFamily(false)}>
                        Send Request
                    </Button>
                    <Button fontSize={"xl"} width={"100%"} ml={2} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }} onClick={() => setAddingFamily(false)}>Cancel</Button>
                </ModalFooter>

            </ModalContent>
        </Modal>

    );
}

export default AddFamily;