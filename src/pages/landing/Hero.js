import { Box, Button, Image, Flex, Img, Spacer, Text, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import heroBackground from '../../assets/eee.png';

const Hero = () => {
    const [isLargerThanLG] = useMediaQuery('(min-width: 62em)');
    
    const backgroundImage = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${heroBackground})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.4)" 
    };
    
    return (
        <Flex
            alignItems="center"
            w="full"
            px={isLargerThanLG ? '16' : '6'}
            py="16"
            minHeight="92vh"
            justifyContent="space-between"
            style={backgroundImage}
        >
            <Box
                mr={isLargerThanLG ? '6' : '0'}
                w={isLargerThanLG ? '60%' : 'full'}
                bg="rgba(230, 225, 205, 0.90)"
                borderRadius="md"
                p="6"
                mb={"20px"}
                boxShadow={"0px 4px 8px rgba(0, 0, 0, 0.5)"}
            >
                <Text
                    fontSize={isLargerThanLG ? '44px' : '40px'}
                    fontWeight="bold"
                    color="black"
                >
                    Discover Timeless Treasures
                </Text>

                <Text mb="6" mt="2" fontWeight={"450"} fontSize={'26px'} opacity={0.8} color="black">
                    Unearth recipes, stories, and wisdom passed down through time. Our community offers everyone an opportunity to share and preserve treasures that enrich the collective human experience and story.
                </Text>
                <Flex flex={1} width={"100%"} justifyContent={"center"}>
                    <Button alignSelf={"center"} width={"100%"} mb="2" height={"42px"} fontSize={"24px"} fontWeight={"600"} colorScheme="blue" as="a" href="/signup">
                        Join The Community
                    </Button>
                </Flex>

            </Box>
            <Spacer />
            <Flex
                w={isLargerThanLG ? '40%' : 'full'}
                alignItems="center"
                justifyContent="center"
                display={isLargerThanLG ? 'flex' : 'none'}
            >
                {/* <Image borderRadius={"2px"} src={heroBackground} opacity={0.9} alt="Timeless Treasures" /> */}
            </Flex>
        </Flex>
    );
};

export default Hero;