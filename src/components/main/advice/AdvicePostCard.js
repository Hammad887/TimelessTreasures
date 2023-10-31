import { Box, Flex, Image, Tag, TagLabel, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { v4 as uuid } from 'uuid';

import UserInfo from '../UserInfo';

import Votes from '../Votes';

import { useNavigate } from 'react-router-dom';

const AdvicePostCard = ({ advice }) => {

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/advice/${advice.id}`);
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

                <UserInfo id={advice.user} />
                <VStack align="start" spacing={3}>
                    <Text marginBottom={'-7px'} fontSize="2xl" fontWeight="bold">
                        Request: {advice.request}
                    </Text>
                    <Text fontSize={"xl"} fontWeight={"normal"} noOfLines={3}>{advice.context}</Text>
                    <Box>

                        <Flex mb={"4px"} justifyContent={"flex-start"} flexWrap={"wrap"} display="flex" gap={"8px"} flexDirection={"row"}>
                            {advice.originsTag.slice(0, 3).map((origin) => (
                                <Tag size="md" bg="gray.300" borderRadius="10px" lineHeight="1" key={uuid()}>
                                    <Text fontSize="23px">{origin}</Text>
                                </Tag>
                            ))}
                            {advice.typesTag.slice(0, 3).map((type) => (
                                <Box marginBottom={'8px'} height="10px" key={uuid()}>
                                    <Tag fontWeight={"semibold"} height={"23px"} size="md" colorScheme="purple" borderRadius="10px">
                                        <TagLabel fontWeight={"semibold"}>{type}</TagLabel>
                                    </Tag>
                                </Box>
                            ))}
                        </Flex>

                    </Box>
                    {(advice.mainImage) ?
                        <Image
                            borderRadius="md"
                            src={advice.mainImage}
                            width="100%"
                            height="200px"
                            objectFit="cover"
                        />
                        : null}

                    <Flex justify={"flex-end"} alignSelf={"center"}>
                        <Votes postId={advice.adviceCode} postType={"advice"} />
                    </Flex>

                </VStack>
            </Box>

        </Flex>
    );
};

export default AdvicePostCard;
