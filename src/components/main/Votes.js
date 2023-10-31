import React, { useState, useEffect } from 'react';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';

import { TbArrowBigUpFilled, TbArrowBigUp, TbArrowBigDownFilled, TbArrowBigDown } from "react-icons/tb";

import { useUser } from '../../UserContext.js';

const Votes = ({ postId, postType }) => {

    const { user, setUser } = useUser();

    const [change, setChange] = useState(false);

    const [score, setScore] = useState(1);
    const [likeUsers, setLikeUsers] = useState([]);
    const [dislikeUsers, setDislikeUsers] = useState([]);

    useEffect(() => {
        const fetchVotes = async () => {
            const postRef = doc(db, postType, postId);
            const postDoc = await getDoc(postRef);
            if (postDoc.exists()) {
                let data = postDoc.data();

                if (data.score === 0 || data.score) {
                    setScore(data.score);
                }

                if (data.likeUsers) {
                    setLikeUsers(data.likeUsers);
                }

                if (data.dislikeUsers) {
                    setDislikeUsers(data.dislikeUsers);
                }
            }
        };

        fetchVotes();
    }, [postId, change]);

    const handleUpvote = async (e) => {
        e.stopPropagation();

        const postRef = doc(db, postType, postId);
        if (likeUsers.includes(user.uid)) {

            let newScore = Math.max(0, score - 1);
            await updateDoc(postRef, {
                score: newScore,
                likeUsers: arrayRemove(user.uid)
            });
            setChange(!change);

        } else {

            if (dislikeUsers.includes(user.uid)) {

                await updateDoc(postRef, {
                    score: score + 1,
                    likeUsers: arrayUnion(user.uid),
                    dislikeUsers: arrayRemove(user.uid)
                });
                setChange(!change);

            } else {

                await updateDoc(postRef, {
                    score: score + 1,
                    likeUsers: arrayUnion(user.uid)
                });
                setChange(!change);

            }
        }
    };

    const handleDownvote = async (e) => {
        e.stopPropagation();

        const postRef = doc(db, postType, postId);

        if (dislikeUsers.includes(user.uid)) {

            await updateDoc(postRef, {
                score: score + 1,
                dislikeUsers: arrayRemove(user.uid)
            });
            setChange(!change);

        } else {

            let newScore = Math.max(0, score - 1);

            if (likeUsers.includes(user.uid)) {

                await updateDoc(postRef, {
                    score: newScore,
                    likeUsers: arrayRemove(user.uid),
                    dislikeUsers: arrayUnion(user.uid)
                });
                setChange(!change);

            } else {

                await updateDoc(postRef, {
                    score: newScore,
                    dislikeUsers: arrayUnion(user.uid)
                });
                setChange(!change);

            }
        }
    };

    return (
        <Box display="flex" alignItems="center">
            <IconButton
                bg={"none"}
                aria-label="Upvote"
                icon={<TbArrowBigUpFilled />}
                fontSize={"28px"}
                size={"sm"}
                onClick={(e) => handleUpvote(e)}
                color={(likeUsers.includes(user.uid)) ? 'green.500' : 'gray.400'}
            />
            <Text fontSize={"22px"} color={"gray.700"} fontWeight={"normal"} mx={2}>{score}</Text>
            {/* <IconButton
                bg={"none"}
                aria-label="Downvote"
                icon={<TbArrowBigDownFilled />}
                fontSize={"28px"}
                size={"sm"}
                onClick={(e) => handleDownvote(e)}
                color={(dislikeUsers.includes(user.uid)) ? 'red.400' : 'gray.400'}
            /> */}
        </Box>
    );
};

export default Votes;