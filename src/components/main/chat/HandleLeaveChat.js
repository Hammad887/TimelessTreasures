// AddRecipe.js

import React, { useEffect, useState } from "react";

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button
} from "@chakra-ui/react";

import {
    doc,
    updateDoc,
    getDoc
} from "firebase/firestore";

import { db } from "../../../firebase.js";

import { useNavigate } from 'react-router-dom';

const HandleLeaveChat = ( { chatCode, userID, leaveChatConfirmation, setLeaveChatConfirmation } ) => {
        
    const navigate = useNavigate();

    async function leaveChat() {
        try {
            const chatRef = doc(db, "chats", chatCode);
            const chatDoc = await getDoc(chatRef);
            const chatData = chatDoc.data();
            if (!chatData) {
                throw new Error("Chat not found.");
            }
            const members = chatData.members.filter(member => member !== userID);
            await updateDoc(chatRef, { members });
            navigate('/chats');
            console.log(`User ${userID} removed from chat ${chatCode}.`);
        } catch (error) {
            console.error("Error removing user from chat: ", error);
            throw error;
        }
    }

    const [alertErrors, setAlertErrors] = useState([]);

    const cancelRef = React.useRef()

    const handleAlertClose = () => {
        setLeaveChatConfirmation(false);
    };

    return (
            
        <AlertDialog
            isOpen={leaveChatConfirmation}
            leastDestructiveRef={cancelRef}
            initialFocusRef={cancelRef}
            onClose={handleAlertClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent top={"22%"}>
                    <AlertDialogHeader>Are you sure you want to leave the chat?</AlertDialogHeader>
                        <AlertDialogBody>You cannot join back unless added by one of its members.</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button colorScheme="red" mr={3} onClick={leaveChat}>Yes</Button>
                        <Button autoFocus ref={cancelRef} onClick={() => setLeaveChatConfirmation(false)}>No</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>

    );
}

export default HandleLeaveChat;