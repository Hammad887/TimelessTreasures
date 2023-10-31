import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    Stack,
    Text,
    VStack,
    Container,
    chakra,
    IconButton,
    Flex
} from "@chakra-ui/react";

import { LockIcon } from "@chakra-ui/icons";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import { useUser } from "../../UserContext";

const Privacy = ({ openPrivacy, setOpenPrivacy }) => {
    const { user, setUser } = useUser();

    const [isOpen, setIsOpen] = useState(false);

    const [privacyLevel, setPrivacyLevel] = useState("Everybody");

    const onClose = () => {
        setOpenPrivacy(false);
    };

    const changeAndClose = () => {
        if (user) {
            saveUserSettings();
        }
        setOpenPrivacy(false);
    };

    const StickyButtonContainer = chakra(Container, {
        baseStyle: {
            position: "fixed",
            bottom: "1.25em",
            right: "7rem",
            zIndex: "100000",
            width: "9.5em"
        },
    });

    useEffect(() => {
        const fetchUserSettings = async () => {
            if (user) {
                try {
                    const privacyDoc = await getDoc(doc(db, "privacy", user.uid));
                    if (privacyDoc.exists()) {
                        const privacyData = privacyDoc.data();
                        setPrivacyLevel(privacyData.privacyLevel);
                    } else {
                        // Set default values if no user settings exist in Firestore
                        setPrivacyLevel("Everybody");
                    }
                } catch (error) {
                    console.error("Error fetching privacy settings:", error);
                }
            } else {
                // Set default values if no user is logged in
                setPrivacyLevel("Everybody");
            }
        };

        fetchUserSettings();
    }, [openPrivacy]);

    const saveUserSettings = async () => {
        try {
            await setDoc(doc(db, "privacy", user.uid), {
                privacyLevel: privacyLevel,
            });
        } catch (error) {
            console.error("Error saving user settings:", error);
        }
    };

    return (
        <Flex>
            <StickyButtonContainer>
                <IconButton
                    onClick={() => setOpenPrivacy(true)}
                    icon={<LockIcon mb={0.5} />}
                    aria-label="Settings"
                    borderRadius="full"
                    fontSize="30px"
                    bg={"pink.300"}
                    _hover={{bg: "pink.400"}}
                    height={"60px"}
                    opacity={(openPrivacy) ? "80%" : "100%"}
                    width={"60px"}
                    boxShadow="0px 0 6px rgba(0, 0, 0, 0.9)"
                />
            </StickyButtonContainer>
            <Modal blockScrollOnMount={false} isOpen={openPrivacy} onClose={onClose}>
                <ModalOverlay />
                <ModalContent alignSelf={"center"} mt={2} pt={2} maxW={{ base: "95%", md: "80%" }}>
                    <ModalHeader textAlign={"center"} fontWeight={"bold"} pb={0} fontSize={"2xl"}>Privacy Options</ModalHeader>
                    <ModalBody>
                        <VStack px={{ base: 0, md: 4 }} spacing={4} align="stretch">
                            <Box>
                                <Text fontSize="18px" mt={3} textAlign={"center"} color={"red"} fontWeight="600"> 
                                    Warning: Not fully implemented. Options other than "everyone" may cause bugs.
                                </Text>
                                <Text fontSize="xl" mb={4} fontWeight="500"> 
                                    Who do you want to be able to see your profile, recipebook, and storybook?
                                </Text>
                                <RadioGroup
                                    value={privacyLevel}
                                    onChange={(value) => setPrivacyLevel(value)}
                                >
                                    <Stack direction={{ base: "column" }}>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="Nobody"><Text fontSize={"24px"} fontWeight={"500"}><b>Completely Private</b> (Nobody, including your family and connections)</Text></Radio>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="Family"><Text fontSize={"24px"} fontWeight={"500"}><b>Family</b> (Only your family)</Text></Radio>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="Connections"><Text fontSize={"24px"} fontWeight={"500"}><b>Connections</b> (Family & Connections)</Text></Radio>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="Everybody"><Text fontSize={"24px"} fontWeight={"500"}><b>Completely Public</b> (Everybody)</Text></Radio>
                                    </Stack>
                                </RadioGroup>
                                <Text fontSize="18px" mt={3} textAlign={"center"} color={"red"} fontWeight="600"> 
                                    Note that any comments you make are still public, regardless of option.
                                </Text>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter mb={2} width={"100%"} justifyContent={"center"}>
                        <Button bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }} fontSize={"xl"} width={"100%"} onClick={changeAndClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex >
    );
};

export default Privacy;