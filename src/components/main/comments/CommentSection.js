import { Box, Button, Flex, Input, InputGroup, VStack, useMediaQuery } from '@chakra-ui/react';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';

import Comment from './Comment';

import { useUser } from '../../../UserContext';

const CommentSection = ({ type, postId }) => {

    const { user, setUser } = useUser();

    const [isMobile] = useMediaQuery("(max-width: 600px)");

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        // Fetch comments for the post from the database
        const recipeRef = doc(db, type, postId);
        const commentsRef = collection(recipeRef, 'comments');
        const q = query(commentsRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedComments = [];
            querySnapshot.forEach((doc) => {
                fetchedComments.push({ ...doc.data(), id: doc.id });
            });
            setComments(fetchedComments);
        });

        return () => unsubscribe();
    }, [postId]);

    const handleAddComment = async () => {
        if (newComment.trim()) {
            const recipeRef = doc(db, type, postId);
            const commentsRef = collection(recipeRef, 'comments');

            await addDoc(commentsRef, {
                user: user.uid,
                content: newComment,
                timestamp: new Date(),
                likes: 0,
                replies: [],
            });
            setNewComment('');
        }
    };

    const handleDeleteComment = async (commentId) => {
        const recipeRef = doc(db, type, postId);
        const commentRef = doc(recipeRef, 'comments', commentId);

        await deleteDoc(commentRef);
    };

    const handleLikeComment = async (commentId) => {
        const recipeRef = doc(db, type, postId);
        const commentRef = doc(recipeRef, 'comments', commentId);

        const docSnapshot = await getDoc(commentRef);
        if (docSnapshot.exists()) {
            const currentLikes = docSnapshot.data().likes;
            await updateDoc(commentRef, {
                likes: currentLikes + 1,
            });
        }
    };

    const handleReportComment = async (commentId) => {
        const recipeRef = doc(db, type, postId);
        const commentRef = doc(recipeRef, 'comments', commentId);

        await updateDoc(commentRef, {
            reported: true,
        });
    };

    return (
        <Flex width="100%" direction="row" justifyContent="center" alignItems="center">
            <VStack flex="1">
                <Box p={{ base: 4, md: 6 }} pb={2} width={"100%"}>
                    <InputGroup w={"100%"} alignItems="flex-end">
                        <Input
                            bgColor={"commentInputBG"}
                            borderColor={"commentInputBorder"}
                            borderWidth={"2px"}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <Button ml={"15px"} px={"20px"} colorScheme={"blue"} onClick={handleAddComment}>Post</Button>
                    </InputGroup>
                </Box>
                <Box px={{ base: 4, md: 6 }} width={"100%"}>
                    {comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            currentUser={user.uid}
                            postAuthorId={postId}
                            onLike={handleLikeComment}
                            onDelete={handleDeleteComment}
                            onReport={handleReportComment}
                        />
                    ))}
                </Box>
            </VStack>
        </Flex>

    );
};

export default CommentSection;