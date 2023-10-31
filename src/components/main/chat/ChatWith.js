import {
    Box,
    Button,
    Flex,
    HStack,
    Image,
    Spacer,
    Text,
    VStack
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";


import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";


import { useNavigate } from "react-router-dom";


import defaultPFP from "../../../assets/defaultPFP.jpg";

const UserInfoSelectConnections = ( { ids, onClick, isSelected } ) => {

    const [profile, setProfile] = useState({});

    const navigate = useNavigate();

    useEffect(() => {

        const fetchProfile = async () => {
            const profileDoc = await getDoc(doc(db, "users", id));
            setProfile(profileDoc.data());
        };

        fetchProfile();

    }, [id]);

    return (
        <Flex bg={isSelected ? "rgba(0, 0, 120, 0.2)" : "none"} borderRadius={"4px"} cursor={"pointer"} width={"100%"} onClick={() => onClick(id)} alignSelf={"flex-start"}>
            {profile ? (
                <Box p={1}>
                    <Button colorScheme="none" textColor={"black"}>
                        <HStack spacing={3} alignItems={"center"}>
                            <Image
                                src={profile.pfpURL || defaultPFP}
                                alt="Profile picture"
                                boxSize="40px"
                                minW={"40px"}
                                minH={"40px"}
                                borderRadius="full"
                                objectFit="cover"
                                boxShadow={"md"}
                            />
                            <VStack alignItems={"flex-start"} spacing={1}>                                            
                                <Text fontWeight={"semibold"} fontSize="xl">
                                    {profile.name} 
                                </Text>
                            </VStack>
                            <Spacer />
                        </HStack>
                    </Button>
                </Box>
            ) : null }
        </Flex>
    );
};

export default UserInfoSelectConnections;