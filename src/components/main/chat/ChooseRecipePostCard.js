import { Box, Flex, Image, Tag, TagLabel, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { v4 as uuid } from 'uuid';

import { useNavigate } from 'react-router-dom';

import UserInfo from '../UserInfo';

const ChooseRecipePostCard = ({ recipe, shareRecipe }) => {
        
    const navigate = useNavigate();

    const handleCardClick = () => {
        shareRecipe(recipe.id);
    };

    return (
        <Box
            boxShadow="lg"
            p={2}
            borderRadius="md"
            bg="white"
            width={"90%"}
            _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}
            onClick={handleCardClick} 
        >
            <VStack align="start" spacing={3}>
                <Text marginBottom={'-7px'} fontSize="xl" fontWeight="semibold">
                    {recipe.title}
                </Text>
                <Text fontSize={"md"} noOfLines={2}>{recipe.description}</Text>
            </VStack>
        </Box>
    );
};

export default ChooseRecipePostCard;
