import React, { useState, useEffect } from "react";
import { VStack, Flex, Box } from "@chakra-ui/react";
import ActiveChats from "../../components/main/chat/ActiveChats";

import AddChat from "../../components/main/chat/AddChat";

import FlexPhoneOrNot from "../../components/main/FlexPhoneOrNot";

import Navbar from "../../components/main/Navbar";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

import { v4 as uuid } from 'uuid';

import { useUser } from "../../UserContext";

const Chats = () => {

    const { user, setUser } = useUser();

    const [chats, setChats] = useState([]);

    // FETCH CHATS
    useEffect(() => {
        const fetchChats = async () => {
            const chatsRef = collection(db, "chats");
            const q = query(chatsRef, where("members", "array-contains", user.uid));
            const querySnapshot = await getDocs(q);
            const chatsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setChats(chatsData);
        };

        if (user) {
            fetchChats();
        }
    }, [user]);

    // CREATE A CHAT
    async function createChat(users, text) {
        try {

            let usersArray = [...users, user.uid]

            const chatID = uuid();
            const chatsRef = doc(db, "chats", chatID);
            const newChat = {
                chatCode: chatID,
                members: usersArray,
                title: text,
                lastMessage: "",
                timestamp: new Date().getTime(),
            };
            await setDoc(chatsRef, newChat);
            console.log("New chat created successfully!");
        } catch (error) {
            console.error("Error creating chat: ", error);
        }
    }

    // DELETE A CHAT
    async function deleteChat(chatID) {
        try {
            const chatDoc = doc(db, "chats", chatID);
            await deleteDoc(chatDoc);
            console.log("Chat deleted successfully!");
        } catch (error) {
            console.error("Error deleting chat: ", error);
        }
    }
    
    return (

        <Flex bg="mainBG">
            <FlexPhoneOrNot>
                <Flex>
                    <Navbar />
                </Flex>
                <Flex width={"100%"} bg="mainBG" overflow="hidden">
                    <Box flex="1" maxHeight={"100vh"} p={6}>
                        <Flex width={"100%"}>
                            <VStack width={"100%"}>
                                {(user) ?
                                    <>
                                        <AddChat userUID={user.uid} onAddChat={createChat} />
                                        <ActiveChats chats={chats} onDeleteChat={deleteChat} />
                                    </>
                                    : null
                                }
                            </VStack>
                        </Flex>
                    </Box>
                </Flex>
            </FlexPhoneOrNot>
        </Flex>
    );
};

export default Chats;