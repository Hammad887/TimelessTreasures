import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Adjust this import path to your firebase configuration file

const ChatMessages = ({ senderId, recipientId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const messagesRef = collection(db, "messages");
        const q = query(
            messagesRef,
            orderBy("timestamp", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = [];
            snapshot.forEach((doc) => {
                const message = doc.data();
                if (
                    (message.senderId === senderId && message.recipientId === recipientId) ||
                    (message.senderId === recipientId && message.recipientId === senderId)
                ) {
                    fetchedMessages.push(message);
                }
            });
            setMessages(fetchedMessages.reverse());
        });

        return () => {
            unsubscribe();
        };
    }, [senderId, recipientId]);

    return (
        <Box>
            {messages.map((message, index) => (
                <Box key={index} textAlign={message.senderId === senderId ? "right" : "left"}>
                    {message.content}
                </Box>
            ))}
        </Box>
    );
};

export default ChatMessages;