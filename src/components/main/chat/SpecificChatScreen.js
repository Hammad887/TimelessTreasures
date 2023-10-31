import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
    Box,
    Button,
    Flex,
    HStack,
    Input,
    VStack,
    Text,
    Avatar,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    MenuItem,
    MenuList,
    MenuButton,
    Menu,
    Spacer,
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton
} from "@chakra-ui/react";

import { MdMoreVert } from "react-icons/md";

import Navbar from "../Navbar";
import FlexPhoneOrNot from "../FlexPhoneOrNot";

import { auth, db } from "../../../firebase";

import {
    collection,
    onSnapshot,
    addDoc,
    query,
    orderBy,
    doc,
    updateDoc,
    getDoc
} from "firebase/firestore";

import RecipeBook from "../profile/RecipeBook";
import ChooseRecipe from "./ChooseRecipe";
import ChooseStory from "./ChooseStory";

import ChatMessageRender from "./ChatMessageRender";
import ChatEditor from "./ChatEditor";
import HandleLeaveChat from "./HandleLeaveChat";

import { useUser } from "../../../UserContext";

const SpecificChatScreen = () => {

    const { id } = useParams();

    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const [chat, setChat] = useState(null);

    const [profilePictures, setProfilePictures] = useState({});

    const [isOpen, setIsOpen] = useState(false);

    const cancelRef = React.useRef();

    const { user, setUser } = useUser();

    const [editedChat, setEditedChat] = useState(false);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        const fetchChatData = async () => {
            const chatRef = doc(db, "chats", id);
            const chatSnapshot = await getDoc(chatRef);
            if (chatSnapshot.exists()) {
                setChat(chatSnapshot.data());
            }
        };

        const fetchMessages = async () => {
            const chatRef = collection(db, "chats", id, "messages");
            const orderedMessages = query(chatRef, orderBy("timestamp"));
            onSnapshot(orderedMessages, (snapshot) => {
                setMessages(
                    snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
                );
            });
        };

        fetchMessages();
        fetchChatData();
    }, [id, editedChat]);

    useEffect(() => {
        async function fetchData() {
            if (chat && chat.members) {
                let pfps = await fetchProfilePictures(chat.members);
                setProfilePictures(pfps);
            }
        }
        fetchData();
    }, [chat]);

    async function fetchProfilePictures(userIds) {
        try {
            const userPromises = userIds.map(async (userId) => {
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    return { userId, pfpURL: userDoc.data().pfpURL };
                }
                return null;
            });

            const profilePicturesData = await Promise.all(userPromises);
            const profilePictures = profilePicturesData.reduce((result, data) => {
                if (data) {
                    result[data.userId] = data.pfpURL;
                }
                return result;
            }, {});

            return profilePictures;
        } catch (error) {
            console.error('Error fetching profile pictures:', error);
            return {};
        }
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes()}`;
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const newMessage = {
            uid: user.uid,
            content: input,
            timestamp: new Date().getTime(),
        };

        try {
            await addDoc(collection(db, "chats", id, "messages"), newMessage);

            let docRef = doc(db, "chats", id);
            await updateDoc(docRef, { lastMessage: [input, profilePictures[user.uid]] });
            
            setInput("");
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    const onClose = () => {
        setChoosingRecipe(false);
        setChoosingStory(false);
        setEditingChat(false);
    };

    const shareRecipe = async (recipeID) => {
        const newMessage = {
            uid: user.uid,
            recipe: true,
            content: recipeID,
            timestamp: new Date().getTime(),
        };

        try {
            await addDoc(collection(db, "chats", id, "messages"), newMessage);
            setInput("");
            onClose();
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    const shareStory = async (storyID) => {
        const newMessage = {
            uid: user.uid,
            story: true,
            content: storyID,
            timestamp: new Date().getTime(),
        };

        try {
            await addDoc(collection(db, "chats", id, "messages"), newMessage);
            setInput("");
            onClose();
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    const [leaveChatConfirmation, setLeaveChatConfirmation] = useState(false);
    const [choosingRecipe, setChoosingRecipe] = useState(false);
    const [choosingStory, setChoosingStory] = useState(false);
    const [editingChat, setEditingChat] = useState(false);

    return (
        <Flex bg="chatBG">
            <FlexPhoneOrNot>
                <Box>
                    <Navbar />
                </Box>
                <Box width={"100%"}>

                    {/* ALL THE MODAL STUFF BELOW!!! */}
                    <ChooseRecipe uid={user.uid} isOpen={choosingRecipe} onClose={onClose} shareRecipe={shareRecipe} />
                    <ChooseStory uid={user.uid} isOpen={choosingStory} onClose={onClose} shareStory={shareStory} />
                    <HandleLeaveChat chatCode={id} userID={user.uid} leaveChatConfirmation={leaveChatConfirmation} setLeaveChatConfirmation={setLeaveChatConfirmation} />
                    <Modal isOpen={editingChat} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Chat Settings</ModalHeader>
                            <ChatEditor
                                uid={user.uid}
                                chatID={id}
                                chat={chat}
                                onClose={onClose}
                                editedChat={editedChat}
                                setEditedChat={setEditedChat}
                            />
                        </ModalContent>
                    </Modal>

                    <HStack alignItems={"center"} boxShadow="0 5px 5px rgba(0, 0, 0, 0.05)" p={2}>
                        { (chat) ? <Heading ml={"1rem"} fontSize={"xl"}>{chat.title}</Heading> : null }
                        <Spacer />
                        <Menu>
                            <MenuButton bg={"gray.200"} as={Button} iconSpacing={0} rightIcon={<MdMoreVert color="gray" size={"20px"} />} />
                            <MenuList>
                                <MenuItem onClick={() => setEditingChat(true)}>Rename Chat</MenuItem>
                                <MenuItem onClick={() => setEditingChat(true)}>Add / Remove Members</MenuItem>
                                <MenuItem color={"red"} onClick={() => setLeaveChatConfirmation(true)}>Leave chat</MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                    <VStack spacing={4} p={6} overflowY="auto" height="70vh">
                        {messages.map(({ id, data }) => (
                            <HStack
                                key={id}
                                bg={user.uid === data.uid ? "blue.200" : "gray.200"}
                                borderRadius="lg"
                                p={3}
                                spacing={3}
                                alignSelf={user.uid === data.uid ? "flex-end" : "flex-start"}
                                maxWidth="70%"
                                boxShadow={"md"}
                            >
                                {(user.uid !== data.uid) ?
                                    <Avatar src={profilePictures[data.uid]} size="sm" />
                                    : null}

                                <VStack alignItems={user.uid === data.uid ? "flex-end" : "flex-start"} spacing={1}>

                                    {(data.recipe || data.story) ?
                                        <ChatMessageRender post={data} />
                                        :
                                        <>
                                            <Text style={{ wordBreak: 'break-all' }} fontWeight={"normal"} fontSize={"xl"}>{data.content}</Text>
                                            <Text wordBreak={true} fontSize="sm" color="gray.500">
                                                {formatTimestamp(data.timestamp)}
                                            </Text>
                                        </>
                                    }

                                </VStack>

                                {(user.uid === data.uid) ?
                                    <Avatar src={profilePictures[data.uid]} size="sm" />
                                    : null}

                            </HStack>
                        ))}

                        <Box ref={messagesEndRef} />

                    </VStack>
                    <Box width={"100%"} boxShadow="0 -5px 10px rgba(0, 0, 0, 0.05)" height={"150px"} bg="chatBG" bottom={0} zIndex={10} position={"sticky"}>
                        <form onSubmit={sendMessage}>
                            <HStack width={"100%"} p={4} mr={"95px"}>
                                <Input
                                    value={input}
                                    bg={"gray.50"}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message here..."
                                    borderRadius="10px"
                                />
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    px={6}
                                    borderRadius="10px"
                                    disabled={!input.trim()}
                                >
                                    Send
                                </Button>
                            </HStack>
                        </form>
                        <Box ml={"1.3em"} mt={"0.8em"}>
                            <HStack>
                                <Box>
                                    <Button bg={"gray.200"} _hover={{ bg: "gray.300" }} color="gray.600" onClick={() => setChoosingStory(true)}>
                                        Share a Story
                                    </Button>
                                </Box>
                                <Box pl={"0.5em"}>
                                    <Button bg={"gray.200"} _hover={{ bg: "gray.300" }} color="gray.600" onClick={() => setChoosingRecipe(true)}>
                                        Share a Recipe
                                    </Button>
                                </Box>
                            </HStack>
                        </Box>
                    </Box>

                </Box>
            </FlexPhoneOrNot>
        </Flex>
    );
};

export default SpecificChatScreen;