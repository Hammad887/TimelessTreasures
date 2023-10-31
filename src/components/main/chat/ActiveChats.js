import React from "react";
import { VStack, Box, Text, IconButton, HStack, Avatar } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { useNavigate } from "react-router-dom";

const ActiveChats = ({ chats, onDeleteChat }) => {
    const navigate = useNavigate();

    const handleChatClick = (id) => {
        navigate(`/chat/${id}`);
    };

    return (
        <VStack width={"100%"} pt={2} spacing={4}>
            {chats.map((chat, index) => (
                <Box
                    key={index}
                    width={"100%"}
                    alignItems={"center"}
                    bg={"white"}
                    borderRadius="md"
                    boxShadow="lg"
                    transition="0.2s"
                    _hover={{ transform: "scale(1.01)", cursor: "pointer" }}
                >
                    <HStack justifyContent="space-between" width="100%">
                        <Box width={"100%"} padding={4} onClick={() => handleChatClick(chat.chatCode)}>
                                <Text fontSize="xl" fontWeight="semibold">
                                    {chat.title}
                                </Text>
                                {chat.lastMessage ?
                                <HStack>
                                    <Text fontSize="md">
                                        {`Last Message: "${chat.lastMessage[0].slice(0,60)}" from`}
                                    </Text> 
                                    <Box pl={"5px"}>
                                        <Avatar src={chat.lastMessage[1]} size="sm" />
                                    </Box>
                                </HStack>
                                : null}
                        </Box>
                        {/* <Box>
                            <IconButton
                                mr={4}
                                aria-label="Delete chat"
                                icon={<DeleteIcon />}
                                onClick={() => onDeleteChat(chat.chatCode)}
                                colorScheme="red"
                            />
                        </Box> */}
                    </HStack>
                </Box>
            ))}
        </VStack>
    );
};

export default ActiveChats;