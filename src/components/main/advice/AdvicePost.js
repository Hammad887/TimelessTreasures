import { deleteDoc, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Flex,
    HStack,
    Heading,
    Image,
    Modal,
    ModalOverlay,
    Text,
    VStack,
    Divider,
} from "@chakra-ui/react";

import Navbar from '../Navbar';

import { auth, db } from '../../../firebase';
import CommentSection from '../comments/CommentSection';

import EditAdvice from './EditAdvice';

import ReportModal from '../ReportModal';

import FlexPhoneOrNot from '../FlexPhoneOrNot';
import UserInfoInPost from '../UserInfoInPost';

import { useUser } from '../../../UserContext';

import Votes from '../Votes';

const AdvicePost = () => {

    const { id } = useParams();
    const [advice, setAdvice] = useState(null);

    const { user, setUser } = useUser();

    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [actuallyEdited, setActuallyEdited] = useState(false);

    const [reportModalOpen, setReportModalOpen] = useState(false);

    useEffect(() => {
        const fetchAdvice = async () => {
            const adviceRef = doc(db, 'advice', id);
            const adviceSnapshot = await getDoc(adviceRef);
            if (adviceSnapshot.exists()) {
                setAdvice(adviceSnapshot.data());
            }
        };

        fetchAdvice();
    }, [id, actuallyEdited]);

    const navigate = useNavigate();
    const cancelRef = React.useRef()

    const deleteAdvice = async (id) => {
        try {
            const adviceRef = doc(db, 'advice', id);
            await deleteDoc(adviceRef);
            console.log('Advice successfully deleted.');
            navigate('/advice');
        } catch (error) {
            console.error('Error deleting advice:', error);
        }
    }

    if (!advice) return <Text>Loading...</Text>;

    return (
        <Flex bg="postBG">
            <FlexPhoneOrNot>
                <Box>
                    <Navbar />
                </Box>
                <Box mt={"6vh"} flex="1" width={"100%"}>

                    <ReportModal data={advice} reportModalOpen={reportModalOpen} setReportModalOpen={setReportModalOpen} />

                    <Modal closeOnOverlayClick={false} isOpen={editing} onClose={() => setEditing(false)}>
                        <ModalOverlay />
                        <EditAdvice onClose={() => setEditing(false)} actuallyEdited={() => setActuallyEdited(!actuallyEdited)} adviceToEdit={advice} />
                    </Modal>

                    <AlertDialog
                        closeOnOverlayClick={false}
                        isOpen={deleting}
                        leastDestructiveRef={cancelRef}
                        initialFocusRef={cancelRef}
                        onClose={() => setDeleting(false)}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent top={"21%"}>
                                <AlertDialogHeader fontWeight={"bold"} fontSize={"xl"} pb={"0px"}>Are you sure you want to delete your post?</AlertDialogHeader>
                                <AlertDialogBody fontWeight={"boldish"} fontSize={"lg"} pb={"0px"}>Deleted posts cannot be recovered.</AlertDialogBody>
                                <AlertDialogFooter mb={2} width={"100%"} justifyContent={"center"}>
                                    <Button width={"100%"} fontSize={"xl"} colorScheme="red" mr={3} onClick={() => deleteAdvice(advice.adviceCode)}>Yes</Button>
                                    <Button width={"100%"} fontSize={"xl"} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }} autoFocus ref={cancelRef} onClick={() => setDeleting(false)}>No</Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>

                    {(advice.user === user.uid) ?
                        <Box mb={5}>
                            <HStack justifyContent={"center"}>
                                <Button onClick={() => setEditing(true)} colorScheme="blue" height={"30px"} size="md">
                                    Edit Post
                                </Button>
                                <Button onClick={() => setDeleting(true)} colorScheme="red" height={"30px"} size="md">
                                    Delete Post
                                </Button>
                            </HStack>
                        </Box>
                    : null}

                    <Box mb={"10px"}>
                        <UserInfoInPost id={advice.user} />
                    </Box>
                    <VStack>
                        <Heading textAlign="center" mt={2} size={"lg"}>Request: {advice.request}</Heading>
                        {(advice.mainImage) ?
                            <Flex
                                width={"60vw"}
                                maxH={"60vw"}
                                maxW={"80vh"}
                                borderRadius="md"
                            >
                                <Image
                                    borderRadius="md"
                                    src={advice.mainImage}
                                    alt={advice.request}
                                    width="100%"
                                    objectFit="contain"
                                />
                            </Flex>
                            : null
                        }
                    </VStack>

                    <Box m={{ base: 4, md: 6 }}>
                        <Box borderTopColor={"postDividersBtwn"} borderTopWidth={"4px"} borderRadius={"xl"} p={3} boxShadow={"md"} bg={"postContentBG"}>
                            <Text fontWeight="normal" fontSize="xl" px="1">
                                {advice.context}
                            </Text>
                        </Box>
                    </Box>

                    <Box mb={7} />
                    <Box>
                        <Box mb={7}>

                            <Flex mb={5} justify={"center"}>
                                <Votes postPage={true} postId={advice.adviceCode} postType={"advice"} />
                            </Flex>

                            {(advice.user === user.uid) ?
                                null
                                :
                                <HStack justifyContent={"center"}>
                                    <Button onClick={() => setReportModalOpen(true)} colorScheme="gray" color={"red"} height={"30px"} size="md">
                                        Report Post
                                    </Button>
                                </HStack>
                            }
                        </Box>
                        <CommentSection type="advice" postId={id} />
                        <Box mb={20} />
                    </Box>
                </Box>
            </FlexPhoneOrNot>
        </Flex>
    );
};

export default AdvicePost;


