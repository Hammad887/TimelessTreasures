import { Box, Flex, Image, Tag, TagLabel, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useNavigate } from 'react-router-dom';

import {
    collection,
    onSnapshot,
    addDoc,
    query,
    orderBy,
    doc,
    updateDoc,
    getDoc
} from "firebase/firestore";

import { auth, db } from "../../../firebase";

import UserInfo from '../UserInfo';

const ChatMessageRender = ({ post }) => {
        
    const [recipe, setRecipe] = useState(null);
    const [story, setStory] = useState(null);

    const navigate = useNavigate();

    const handleCardClick = () => {
        if (recipe) {
            navigate(`/recipe/${post.content}`);
        } else if (story) {
            navigate(`/story/${post.content}`);
        }
    };

    useEffect(() => {
        const fetchRecipe = async () => {
            const recipeRef = doc(db, "recipes", post.content);
            const recipeSnapshot = await getDoc(recipeRef);
            if (recipeSnapshot.exists()) {
                setRecipe(recipeSnapshot.data());
            }
        };

        const fetchStory = async () => {
            const storyRef = doc(db, "stories", post.content);
            const storySnapshot = await getDoc(storyRef);
            if (storySnapshot.exists()) {
                setStory(storySnapshot.data());
            }
        };

        if (post.recipe) {
            fetchRecipe();
        } else if (post.story) {
            fetchStory();
        }
    }, [post]);

    return (
        <Box
            boxShadow="lg"
            p={2}
            borderRadius="md"
            bg="white"
            minW={"30vw"}
            maxW={"40vw"}
            _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}
            onClick={handleCardClick} 
        >
            {  (recipe) ?
            <VStack align="start" spacing={3}>
                <Text marginBottom={'-7px'} fontSize="xl" fontWeight="semibold">
                    {recipe.title}
                </Text>
                <Text fontSize={"md"} noOfLines={2}>{recipe.description}</Text>

                { (recipe.mainImage) ?
                    <Image
                        borderRadius="md"
                        src={recipe.mainImage}
                        width="100%"
                        height="200px"
                        objectFit="cover"
                    /> 
                : null }
            </VStack> : null }

            {  (story) ?
            <VStack align="start" spacing={3}>
                <Text marginBottom={'-7px'} fontSize="xl" fontWeight="semibold">
                    {story.title}
                </Text>
                <Text fontSize={"md"} noOfLines={2}>{story.synopsis}</Text>

                { (story.mainImage) ?
                    <Image
                        borderRadius="md"
                        src={story.mainImage}
                        width="100%"
                        height="200px"
                        objectFit="cover"
                    /> 
                : null }
            </VStack> : null }
        </Box>
    );
};

export default ChatMessageRender;
