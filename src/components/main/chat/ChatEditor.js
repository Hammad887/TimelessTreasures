import {
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Image,
    Input,
    InputGroup,
    ModalBody,
    ModalFooter,
    Text,
    Textarea,
    VStack,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogContent
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";

import SelectConnections from "./SelectConnections";

import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../../../firebase";

const ChatEditor = ({ uid, chatID, chat, onProfileUpdate, onClose, editedChat, setEditedChat }) => {
    const [title, setTitle] = useState(chat.title);
    const [members, setMembers] = useState(chat.members);
    const [isUpdating, setIsUpdating] = useState(false);

    const [errors, setErrors] = useState([]);

    const handleUpdate = async () => {
        const updatedChat = {
            chatCode: chatID,
            title: title,
            members: members,
            lastMessage: "",
            timestamp: chat.timestamp
        };

        await updateDoc(doc(db, "chats", chatID), updatedChat);
        // onProfileUpdate(updatedProfile);
        setEditedChat(!editedChat);
        setIsUpdating(false);
        onClose();
    };

    const [cancelConfirmation, setCancelConfirmation] = useState(false);
    const cancelRef = React.useRef()

    const confirmUpdate = () => {
        setIsUpdating(true);

        let errorList = [];
        if (!title.trim() || members.length < 2) {
            if (!title.trim()) {
                errorList.push("name");
            }

            if (members.length < 2) {
                errorList.push("connections");
            }
            setErrors(errorList);
            setIsUpdating(false);

            return;
        }

        if (members.length < chat.members.length) {
            setCancelConfirmation(true);
            setIsUpdating(false);
        } else {
            handleUpdate();
        }
    };

    return (
        <>
            <AlertDialog
                closeOnOverlayClick={false}
                isOpen={cancelConfirmation}
                leastDestructiveRef={cancelRef}
                initialFocusRef={cancelRef}
                onClose={() => setCancelConfirmation(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent top={"22%"}>
                        <AlertDialogHeader>You have removed a member from the chat.</AlertDialogHeader>
                        <AlertDialogBody>Are you sure you want to remove this member from the chat?</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button colorScheme="red" mr={3} onClick={handleUpdate}>Yes</Button>
                            <Button autoFocus ref={cancelRef} onClick={() => setCancelConfirmation(false)}>No</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <ModalBody align={"center"}>
                <SelectConnections
                    errors={errors} uid={uid}
                    selectedConnections={members}
                    setSelectedConnections={setMembers}
                    selectedProfileNames={null}
                    setSelectedProfileNames={null}
                />
                {(errors.includes("name")) ?
                    <Text color={"red"} textAlign={"center"} fontSize="xl">
                        Choose a name for your chat (required)
                    </Text>
                    :
                    <Text color={"black"} textAlign={"center"} fontSize="xl">
                        Choose a name for your chat
                    </Text>
                }
                <Input
                    value={title}
                    width={"90%"}
                    size={"lg"}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`Enter chat name, ex/ "daughter, dance group, gardening club"`}
                />
            </ModalBody>
            <ModalFooter>
                <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={confirmUpdate}
                    isLoading={isUpdating}
                    disabled={isUpdating}
                >
                    Update Chat
                </Button>
                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </ModalFooter>
        </>
    );
};

export default ChatEditor;