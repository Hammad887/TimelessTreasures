import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Grid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalFooter,
    VStack,
    ModalHeader
} from '@chakra-ui/react';

import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';

import { db } from "../../../firebase.js";

import { v4 as uuid } from 'uuid';
import ChooseStoryPostCard from './ChooseStoryPostCard.js';

const ChooseStory = ({ uid, isOpen, onClose, shareStory }) => {
    const [stories, setStories] = useState([]);

    const [loading, setLoading] = useState(false);

    const fetchStories = async () => {
        if (!loading) {
            setLoading(true);
            const storiesRef = collection(db, 'stories');

            let q;

            q = query(
                storiesRef,
                where('user', '==', uid),
                orderBy('timestamp', 'desc'),
            );
            
            const querySnapshot = await getDocs(q);

            const docs = [];

            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });

            setStories(docs);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setStories([]);
            fetchStories();
        }
    }, [uid, isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW={{ base: '90%', lg: '80%' }}>

                <ModalHeader pt={"30px"} pb={'0px'} textAlign="center">Select a Story From Your Storybook</ModalHeader>

                <VStack spacing={4} p={4} pt={2}>
                    <Box
                        overflowY="auto"
                        maxH="65vh"
                        w="100%"
                        p={2}
                        pb={5}
                    >
                        <Grid
                            templateColumns={{
                                base: 'repeat(1, 1fr)',
                                md: 'repeat(1, 1fr)',
                                lg: 'repeat(2, 1fr)',
                                xl: 'repeat(2, 1fr)',
                            }}
                            gap={6}
                            alignItems="center"
                            justifyContent="center"
                            placeItems={'center'}
                        >
                            {stories.map((story) => (
                                <ChooseStoryPostCard key={uuid()} story={story} shareStory={shareStory} />
                            ))}
                        </Grid>
                    </Box>
                </VStack>
                <ModalFooter mt={0} mb={"10px"}>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChooseStory;