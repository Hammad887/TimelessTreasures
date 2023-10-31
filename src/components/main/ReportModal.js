import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    VStack,
    Container,
    chakra,
    IconButton,
    Flex,
    useToast,
    Textarea,
    FormLabel,
    FormControl
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

import { useUser } from "../../UserContext";

const ReportModal = ({ data, reportModalOpen, setReportModalOpen }) => {

    const { user, setUser } = useUser();

    const toast = useToast();

    const [reportDescription, setReportDescription] = useState('');

    const submitReportWithDescription = async () => {
        try {
            const reportData = {
                description: reportDescription,
                data: data,
                reporter: user.uid,
            };

            const feedbackRef = collection(db, 'reports');
            await addDoc(feedbackRef, reportData);

            toast({
                title: 'Report sent!',
                description: 'Thank you for reporting the post and keeping the community safe & respectful to all.',
                status: 'success',
                duration: 6000,
                isClosable: true,
                render: () => (
                    <Box color="white" p={3} bg="green.500" borderRadius="md" position="relative">
                        <VStack alignItems="flex-start" spacing={1}>
                            <Text fontSize="lg" fontWeight="bold">
                                Report sent!
                            </Text>
                            <Text fontSize="md" fontWeight={"normal"}>
                                Thank you for reporting the post and keeping the community safe & respectful to all.
                            </Text>
                        </VStack>
                        <CloseIcon position="absolute" top={4} right={4} color="white" onClick={() => toast.closeAll()} />
                    </Box>
                ),
            })

            setReportModalOpen(false);
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error sending report',
                status: 'error',
                duration: 6000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontWeight={"bold"} fontSize={"2xl"} pb={'0px'} textAlign="center">Create Report</ModalHeader>
                <ModalBody>
                    <FormControl>
                        <FormLabel fontSize="xl" mb={1} fontWeight="semibold">Description of the issue:</FormLabel>
                        <Textarea
                            value={reportDescription}
                            onChange={(e) => setReportDescription(e.target.value)}
                            placeholder="Write a short description about the issue..."
                            fontWeight={"normal"}
                            resize="vertical"
                            h={"6em"}
                            size={"lg"}
                        />
                    </FormControl>
                </ModalBody>


                <ModalFooter mb={2} width={"100%"} justifyContent={"center"}>
                    <Button fontSize={"xl"} width={"100%"} colorScheme="red" mr={2} onClick={submitReportWithDescription}>
                        Send
                    </Button>
                    <Button fontSize={"xl"} width={"100%"} ml={2} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }} onClick={() => setReportModalOpen(false)}>Cancel</Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    );
};

export default ReportModal;