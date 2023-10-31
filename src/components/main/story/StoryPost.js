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
    useToast
} from "@chakra-ui/react";

import Navbar from '../Navbar';

import { auth, db } from '../../../firebase';
import CommentSection from '../comments/CommentSection';

import EditStory from './EditStory';

import FlexPhoneOrNot from '../FlexPhoneOrNot';
import UserInfoInPost from '../UserInfoInPost';

import ReportModal from '../ReportModal';

import { useUser } from '../../../UserContext';

import Votes from '../Votes';

const StoryPost = () => {

    const { user, setUser } = useUser();

    const { id } = useParams();
    const [story, setStory] = useState(null);

    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [actuallyEdited, setActuallyEdited] = useState(false);

    const [reportModalOpen, setReportModalOpen] = useState(false);

    useEffect(() => {
        const fetchStory = async () => {
            const storyRef = doc(db, 'stories', id);
            const storySnapshot = await getDoc(storyRef);
            if (storySnapshot.exists()) {
                setStory(storySnapshot.data());
            }
        };

        fetchStory();
    }, [id, actuallyEdited]);

    const navigate = useNavigate();
    const cancelRef = React.useRef()

    const deleteStory = async (id) => {
        try {
            const storyRef = doc(db, 'stories', id);
            await deleteDoc(storyRef);
            console.log('Story successfully deleted.');
            navigate('/stories');
        } catch (error) {
            console.error('Error deleting story:', error);
        }
    }

    const toast = useToast();

    const submitReport = async () => {
        try {

            const reportData = { type: "storypost", id: id, synopsis: story.synopsis, title: story.title, image: story.mainImage, mainstory: story.story, poster: story.user }

            const feedbackRef = collection(db, 'reports');
            await addDoc(feedbackRef, reportData);

            toast({
                title: 'Report sent!',
                description: 'Thank you for reporting the post and keeping the community safe & respectful to all.',
                status: 'success',
                duration: 6000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error sending report',
                description: 'Something went wrong, please try again later.',
                status: 'error',
                duration: 6000,
                isClosable: true,
            });
        }
    };

    if (!story) return <Text>Loading...</Text>;

    return (
        <Flex bg="postBG" width={"100%"}>
            <FlexPhoneOrNot>
                <Box>
                    <Navbar />
                </Box>
                <Box mt={"6vh"} flex="1" width={"100%"}>

                    <ReportModal data={story} reportModalOpen={reportModalOpen} setReportModalOpen={setReportModalOpen} />

                    <Modal closeOnOverlayClick={false} isOpen={editing} onClose={() => setEditing(false)}>
                        <ModalOverlay />
                        <EditStory onClose={() => setEditing(false)} actuallyEdited={() => setActuallyEdited(!actuallyEdited)} storyToEdit={story} />
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
                                    <Button width={"100%"} fontSize={"xl"} colorScheme="red" mr={3} onClick={() => deleteStory(story.storyCode)}>Yes</Button>
                                    <Button width={"100%"} fontSize={"xl"} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }} autoFocus ref={cancelRef} onClick={() => setDeleting(false)}>No</Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>

                    {(story.user === user.uid) ?
                        <Box mb={5}>
                            <HStack justifyContent={"center"}>
                                <Button onClick={() => setEditing(true)} colorScheme="blue" height={"30px"} size="md">
                                    Edit Story
                                </Button>
                                <Button onClick={() => setDeleting(true)} colorScheme="red" height={"30px"} size="md">
                                    Delete Story
                                </Button>
                            </HStack>
                        </Box>
                    : null}

                    <Box>
                        <UserInfoInPost id={story.user} />
                    </Box>

                    <VStack>
                        <Heading textAlign="center" mt={2} size={"lg"}>{story.title}</Heading>
                        {(story.mainImage) ?
                            <Flex
                                width={"60vw"}
                                maxH={"60vw"}
                                maxW={"80vh"}
                                borderRadius="md"
                            >
                                <Image
                                    borderRadius="md"
                                    src={story.mainImage}
                                    alt={story.title}
                                    width="100%"
                                    objectFit="contain"
                                />
                            </Flex>
                            : null
                        }
                    </VStack>

                    <Box m={{ base: 4, md: 6 }}>
                        <Box borderTopColor={"postDividersBtwn"} borderTopWidth={"4px"} borderRadius={"xl"} p={3} boxShadow={"md"} bg={"postContentBG"}>
                            <Text fontWeight="semibold" fontSize="xl" px="1">
                                {story.synopsis}
                            </Text>
                        </Box>
                    </Box>

                    <Box m={{ base: 4, md: 6 }}>
                        <Box borderTopColor={"postDividersBtwn"} borderTopWidth={"4px"} borderRadius={"xl"} p={3} boxShadow={"md"} bg={"postContentBG"}>
                            <Text fontSize="xl" fontWeight={"normal"} px="0.2rem">
                                {story.story}
                            </Text>
                        </Box>
                    </Box>

                    <Box mb={7} />
                    {/* <LikeShare postId={id} /> */}

                    <Box>
                        <Box mb={7}>

                            <Flex mb={5} justify={"center"}>
                                <Votes postPage={true} postId={story.storyCode} postType={"stories"} />
                            </Flex>

                            {(story.user === user.uid) ?
                                null
                                :
                                <HStack justifyContent={"center"}>
                                    <Button onClick={() => setReportModalOpen(true)} colorScheme="gray" color={"red"} height={"30px"} size="md">
                                        Report Story
                                    </Button>
                                </HStack>
                            }
                        </Box>
                        <CommentSection type="recipes" postId={id} />
                        <Box mb={20} />
                    </Box>

                </Box>
            </FlexPhoneOrNot>
        </Flex>
    );
};

export default StoryPost;


