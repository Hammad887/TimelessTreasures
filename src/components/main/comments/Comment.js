import { Box, Flex, HStack, IconButton, Text, VStack, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaRegFlag, FaRegThumbsUp } from 'react-icons/fa';

import UserInfoForComment from './UserInfoForComment';
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';

import ReportModal from '../ReportModal';

const Comment = ({ comment, currentUser, postAuthorId, onLike, onDelete, onReport }) => {

    // const [replyContent, setReplyContent] = useState('');

    // const handleAddReply = () => {
    //    
    // };

    const [reportModalOpen, setReportModalOpen] = useState(false);

    return (
        <Flex mb={2} p={3} borderRadius={"5px"} bg={"commentInputBG"} borderColor={"commentInputBorder"} boxShadow="0px 0 10px rgba(172, 132, 54, 0.1)" width={"100%"}>

            <ReportModal data={comment} reportModalOpen={reportModalOpen} setReportModalOpen={setReportModalOpen} />

            <VStack align="start" spacing={3}>
                <Text fontSize={"xl"} fontWeight={"normal"} >{comment.content}</Text>
                <HStack>
                    <IconButton
                        size={"sm"}
                        icon={<FaRegThumbsUp />}
                        onClick={() => onLike(comment.id)}
                    />
                    <Text fontSize={"md"} fontWeight={"normal"}>{comment.likes} likes</Text>
                    {/* {currentUser && (currentUser.uid === comment.userId || currentUser.uid === postAuthorId) && (
                        <IconButton
                            size={"sm"}
                            icon={<FaRegTrashAlt />}
                            onClick={() => onDelete(comment.id)}
                        />
                    )} */}
                    <Box pl={"10px"} >
                        <UserInfoForComment id={comment.user} />
                    </Box>
                    <IconButton
                        size={"sm"}
                        color={"red.400"}
                        icon={<FaRegFlag />}
                        onClick={() => setReportModalOpen(true)} 
                    />
                </HStack>
                {/* <VStack align="start" spacing={2}> WOULD LOVE TO FINISH ADD REPLIES BUT DECIDED IT'S NOT WORTH FOR NOW
                    <Input
                        display={"flex"}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                    />
                    <Button onClick={handleAddReply}>Reply</Button>
                    {comment.replies.map((reply) => (
                        <Text key={reply.id}>{reply.content}</Text>
                    ))}
                </VStack> */}
            </VStack>
        </Flex>
    );
};

export default Comment;