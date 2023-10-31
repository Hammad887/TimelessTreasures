// Timeless Treasures by Team Elderly Frogs @ UC Berkeley
// Team Members: Bhada Yun, Emily Lee, Hammad Afzal
// This is the Navbar.js file. Most main content will have this rendered on the left side. Provides routing and linking to other pages!

import { Box, Flex, HStack, IconButton, Text, VStack, useMediaQuery } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
    FaBookOpen,
    FaLightbulb,
    FaUser,
    FaUtensils,
    FaHandsHelping
} from "react-icons/fa";

import { auth } from "../../firebase";

// Importing all the various icons
import { ChatIcon } from "@chakra-ui/icons";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";

import { useNavigate } from 'react-router-dom';

import { BsChatDotsFill } from "react-icons/bs";

import { RiHandHeartFill } from "react-icons/ri";

import HandleLogout from "./HandleLogout";

import { useUser } from "../../UserContext";

const Navbar = () => {

    const navigate = useNavigate();

    const [cancelConfirmation, setCancelConfirmation] = useState(false);

    // Calling this function signs you out
    const handleLogout = async () => {
        // "try" to log out, if it didn't workout, log the error to the console. If you can't see the console, open up inspect element on the active browser and open up console
        try {
            await auth.signOut(); // call the signOut method
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const { user, setUser } = useUser();

    const textShadow = "0 1px 2px rgba(0, 0, 0, 0.4)";

    const [isMobile] = useMediaQuery("(max-width: 450px)");
    const [isSmall] = useMediaQuery("(max-width: 600px)");

    return (
        <>
            <HandleLogout cancelConfirmation={cancelConfirmation} setCancelConfirmation={setCancelConfirmation} />
            {(isSmall) ?
                <Flex mb={"10vh"}>
                    <Box
                        as="nav"
                        overflowX="unset"
                        overflowY="unset"
                        position={"fixed"}
                        top="0"
                        w={"100%"}
                        h={"10vh"}
                        zIndex={1000}
                        bg="navBG"
                        color="navText"
                        display="flex"
                        flexDirection={"row"}
                        justifyContent="center"
                        py={4}
                        alignContent={"center"}
                        fontWeight={"semibold"}
                        boxShadow="4px 0 8px rgba(0, 0, 0, 0.3)"
                    >
                        <HStack width={"100%"} justifyContent={"space-between"}>
                            <Box pl={6} display="flex" flexDirection="column" alignItems="center">
                                <Link to={`/profile/${user.uid}`}>
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Profile"
                                        fontSize="xl"
                                        icon={<FaUser size={(isSmall) ? 37 : 22} />}
                                    />
                                </Link>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to="/">
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Home"
                                        fontSize="xl"
                                        icon={<AiFillHome size={(isSmall) ? 43 : 38} />}

                                    />
                                </Link>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to="/recipes">
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Recipes"
                                        fontSize="xl"
                                        icon={<FaUtensils size={(isSmall) ? 36 : 34} />}
                                    />
                                </Link>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to="/stories">
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Stories"
                                        fontSize="xl"
                                        icon={<FaBookOpen size={(isSmall) ? 40 : 35} />}
                                    />
                                </Link>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to="/advice">
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Advice"
                                        fontSize="xl"
                                        icon={<FaHandsHelping size={(isSmall) ? 41 : 36} />}
                                    />
                                </Link>
                            </Box>
                            <Box pr={6} display="flex" flexDirection="column" alignItems="center">
                                <Link to="/chat">
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Chat"
                                        fontSize="30px"
                                        icon={<BsChatDotsFill size={(isSmall) ? "37px" : "35px"} />}
                                    />
                                </Link>
                            </Box>
                        </HStack>
                    </Box >
                </Flex>

                :
                <Box minW={"90px"} h={"100%"}>
                    <Box
                        as="nav"
                        overflowX="unset"
                        overflowY="unset"
                        position="sticky"
                        top="0"
                        minW="90px"
                        height="100vh"
                        bg="navBG"
                        zIndex={1000}
                        color="navText"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        py={8}
                        px={3}
                        display="flex"
                        alignContent={"center"}
                        fontWeight={"semibold"}
                        boxShadow="4px 0 8px rgba(0, 0, 0, 0.3)"
                    >
                        <VStack height={"100%"} justifyContent={"space-between"}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to={`/profile/${user.uid}`}>
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Profile"
                                        fontSize="xl"
                                        icon={<FaUser size={30} />}
                                    />
                                </Link>
                                <Text textShadow={textShadow} fontSize="md" textAlign="center" mt={1}>Profile</Text>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to="/">
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Home"
                                        fontSize="xl"
                                        icon={<AiFillHome size={38} />}

                                    />
                                </Link>
                                <Text textShadow={textShadow} fontSize="md" textAlign="center" mt={1}>Home</Text>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to="/recipes">
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Recipes"
                                        fontSize="xl"
                                        icon={<FaUtensils size={33} />}
                                    />
                                </Link>
                                <Text textShadow={textShadow} fontSize="md" textAlign="center" mt={1}>Recipes</Text>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to="/stories">
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Stories"
                                        fontSize="xl"
                                        icon={<FaBookOpen size={34} />}
                                    />
                                </Link>
                                <Text textShadow={textShadow} fontSize="md" textAlign="center" mt={1}>Stories</Text>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to="/advice">
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Advice"
                                        fontSize="xl"
                                        icon={<FaHandsHelping size={37} />}
                                    />
                                </Link>
                                <Text textShadow={textShadow} fontSize="md" textAlign="center" mt={1}>Advice</Text>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to="/chat">
                                    <IconButton
                                        colorScheme="none"
                                        aria-label="Chat"
                                        fontSize="20px"
                                        icon={<BsChatDotsFill size={"33px"} />}
                                    />
                                </Link>
                                <Text textShadow={textShadow} fontSize="md" textAlign="center" mt={1}>Chat</Text>
                            </Box>
                        </VStack>
                    </Box>
                </Box>
            }
        </>
    );
};

export default Navbar;