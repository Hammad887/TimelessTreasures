import {
    Box,
    Center,
    Flex,
    HStack,
    Image,
    Spacer,
    Text,
    VStack
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import defaultPFP from "../../assets/defaultPFP.jpg";

const UserInfo = ( { id } ) => {

    const [profile, setProfile] = useState({});

    useEffect(() => {

        const fetchProfile = async () => {
            const profileDoc = await getDoc(doc(db, "users", id));
            setProfile(profileDoc.data());
        };
    
        fetchProfile();
    }, [id]);

    return (
        <Flex>
            {profile ? (
                <Box flex="1" p={1}>
                    <Center>
                        {/* <Link to={`/profile/${id}`}> */}
                            <HStack alignItems={"center"}>
                                <Image
                                    src={profile.pfpURL || defaultPFP}
                                    alt="Profile picture"
                                    boxSize="40px"
                                    borderRadius="full"
                                    objectFit="cover"
                                    boxShadow={"md"}
                                />
                                <VStack alignItems={"flex-start"} spacing={1}>                                            
                                    <Text fontWeight={"semibold"} fontSize="lg">
                                        {profile.name} 
                                    </Text>
                                </VStack>
                                <Spacer />
                            </HStack>
                        {/* </Link> */}
                    </Center>
                </Box>
            ) : null }
        </Flex>
    );
};

export default UserInfo;