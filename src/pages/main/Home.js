// Timeless Treasures by Team Elderly Frogs @ UC Berkeley
// Team Members: Bhada Yun, Emily Lee, Hammad Afzal
// This is the Home.js file, the main homepage you see that shows general content available through the app

import {
    Box,
    Flex,
    Grid,
    GridItem,
    VStack,
    useBreakpointValue
} from "@chakra-ui/react";
import React, { useState } from "react";

// Importing Our Own Components
import FeedWindow from "../../components/main/FeedWindow";
import Navbar from "../../components/main/Navbar";

import FlexPhoneOrNot from "../../components/main/FlexPhoneOrNot";
import HomeConnectionsPostCardView from "../../components/main/HomeConnectionsPostCardView";
import HomeFeedPostCardView from "../../components/main/HomeFeedPostCardView.js";
import Chatbot from "../../Chatbot";

const Home = () => {

    const [isCollapsed, setIsCollapsed] = useState(true);

    const columns = useBreakpointValue({ base: 1, md: 1 });

    return (
        <Flex maxh={"100vh"} bg="mainBG">
            <FlexPhoneOrNot>
                <Flex>
                    <Navbar />
                </Flex>
                <Flex  width="100%">
                    <Box flex="1" p={6}>
                        <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={4}>
                            <VStack>
                                <GridItem width="100%">
                                    <Box boxShadow={'0 0 10px rgba(0, 0, 0, 0.4)'} borderRadius={"md"} width="100%" overflow="hidden">
                                        <FeedWindow isCollapsed={!isCollapsed} setIsCollapsed={(e) => setIsCollapsed(!e)} maxh={"78vh"} title="Community">
                                            <HomeFeedPostCardView />
                                        </FeedWindow>
                                    </Box>
                                </GridItem>
                                <GridItem width="100%" paddingTop={"1.5vh"}>
                                    <Box boxShadow={'0 0 10px rgba(0, 0, 0, 0.4)'} borderRadius={"md"} width="100%" overflow="hidden">
                                        <FeedWindow isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} maxh={"78vh"} title="Connections">
                                            <HomeConnectionsPostCardView />
                                        </FeedWindow>
                                    </Box>
                                </GridItem>
                            </VStack>
                        </Grid>
                    </Box>
                </Flex>
            </FlexPhoneOrNot>
        </Flex>
    );
};

export default Home;