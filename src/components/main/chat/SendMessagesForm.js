import React, { useState } from "react";
import { Box, Input, Button } from "@chakra-ui/react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust this import path to your firebase configuration file

const SendMessageForm = ({ senderId, recipientId }) => {
    const [message, setMessage] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const messagesRef = collection(db, "messages");
        await addDoc(messagesRef, {
            senderId,
            recipientId,
            content: message,
            timestamp: new Date(),
        });

        setMessage("");
    };

    return (
        <Box as="form" onSubmit={sendMessage}>
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <Button type="submit">Send</Button>
        </Box>
    );
};

export default SendMessageForm;