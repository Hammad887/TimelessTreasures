import { Box, Flex, Image, Tag, TagLabel, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { v4 as uuid } from 'uuid';

import { useNavigate } from 'react-router-dom';

import UserInfo from '../UserInfo';
import Votes from '../Votes';

const RecipePostCard = ({ isBook, recipe }) => {

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/recipe/${recipe.id}`);
    };

    return (

        <Flex
            flexDirection="column"
            fontWeight="normal"
            width="100%"
            marginBottom={4}
        >

            <Box
                bg="white"
                _hover={{ transform: "scale(1.02)", transition: "0.2s" }}
                onClick={handleCardClick}
                boxShadow="xl"
                p={4}
                p={4}
                borderRadius="md"
            >

                {(isBook) ? null : <UserInfo id={recipe.user} />}

                <VStack align="start" spacing={3}>
                    <Text marginBottom={'-7px'} fontSize="2xl" fontWeight="bold">
                        {recipe.title}
                    </Text>
                    <Text fontSize={"xl"} fontWeight={"normal"} noOfLines={3}>{recipe.description}</Text>
                    <Box>

                        <Flex mb={"4px"} justifyContent={"flex-start"} flexWrap={"wrap"} display="flex" gap={"8px"} flexDirection={"row"}>
                            {recipe.ancestryTag ?
                                <Tag fontWeight={"semibold"} height={"23px"} size="md" colorScheme="blue" borderRadius="10px">
                                    <TagLabel fontWeight={"semibold"}>{recipe.ancestryTag}</TagLabel>
                                </Tag>
                                : null}
                            {recipe.originsTag.slice(0, 3).map((origin) => (
                                <Tag size="md" bg="gray.300" borderRadius="10px" lineHeight="1" key={uuid()}>
                                    <Text fontSize="23px">{origin}</Text>
                                </Tag>
                            ))}
                            {recipe.typesTag.slice(0, 3).map((type) => (
                                <Box marginBottom={'8px'} height="10px" key={uuid()}>
                                    <Tag fontWeight={"semibold"} height={"23px"} size="md" colorScheme="purple" borderRadius="10px">
                                        <TagLabel fontWeight={"semibold"}>{type}</TagLabel>
                                    </Tag>
                                </Box>
                            ))}
                        </Flex>

                    </Box>
                    {(recipe.mainImage) ?
                        <Image
                            borderRadius="md"
                            src={recipe.mainImage}
                            width="100%"
                            height="200px"
                            objectFit="cover"
                        />
                        :
                        <Box>
                            <Text textColor={'gray.800'} fontWeight="semibold" fontSize="lg" px="0.2rem">Ingredients</Text>
                            {recipe.ingredients.map((ingredient) => (
                                <Box borderRadius="full" lineHeight="1" key={uuid()}>
                                    <Text textColor={'gray.700'} fontSize="md" pt="0.7rem" px="0.2rem">{`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}</Text>
                                </Box>
                            ))}
                        </Box>
                    }

                    {(!recipe.mainImage && recipe.ingredients.length < 5) ?
                        <Box>
                            <Text textColor={'gray.800'} fontWeight="semibold" fontSize="lg" px="0.2rem">Directions</Text>
                            {recipe.steps.map((step) => (
                                <Box mb={"10px"} borderRadius="full" lineHeight="1" key={uuid()}>
                                    <Text textColor={'gray.700'} fontSize="md" pt="0.7rem" px="0.2rem">{`Step ${step.id}: ${step.content}`}</Text>
                                </Box>
                            ))}
                        </Box>
                        : null
                    }

                    {/* { (!isBook) ? */}
                        <Flex justify={"flex-end"} alignSelf={"center"}>
                            <Votes postId={recipe.recipeCode} postType={"recipes"} />
                        </Flex>
                    {/* : null} */}

                </VStack>
            </Box>

        </Flex>
    );
};

export default RecipePostCard;
