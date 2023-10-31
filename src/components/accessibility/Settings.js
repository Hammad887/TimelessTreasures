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

import { SettingsIcon } from "@chakra-ui/icons";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import { useUser } from "../../UserContext";

const Settings = () => {
    const { user, setUser } = useUser();

    const [isOpen, setIsOpen] = useState(false);

    const [fontSize, setFontSize] = useState("1.2");
    const [fontWeight, setFontWeight] = useState("400");
    const [buttonSize, setButtonSize] = useState("1");
    const [colorTheme, setColorTheme] = useState("cof");

    const onClose = () => {
        setIsOpen(false);
    };

    const changeAndClose = () => {
        if (user) {
            saveUserSettings();
        }
        setIsOpen(false);
    };

    const StickyButtonContainer = chakra(Container, {
        baseStyle: {
            position: "fixed",
            bottom: "1.25em",
            right: "2rem",
            zIndex: "200000",
            width: "9.5em"
        },
    });

    useEffect(() => {
        const fetchUserSettings = async () => {
            if (user) {
                try {
                    const userSettingsDoc = await getDoc(doc(db, "settings", user.uid));
                    if (userSettingsDoc.exists()) {
                        const userSettingsData = userSettingsDoc.data();
                        setFontSize(userSettingsData.fontSize);
                        setFontWeight(userSettingsData.fontWeight);
                        setButtonSize(userSettingsData.buttonSize);
                        setColorTheme(userSettingsData.colorTheme);
                    } else {
                        // Set default values if no user settings exist in Firestore
                        setFontSize("1");
                        setFontWeight("400");
                    }
                } catch (error) {
                    console.error("Error fetching user settings:", error);
                }
            } else {
                // Set default values if no user is logged in
                setFontSize("1.2");
                setFontWeight("400");
            }
        };

        fetchUserSettings();
    }, [isOpen]);

    const saveUserSettings = async () => {
        try {
            await setDoc(doc(db, "settings", user.uid), {
                fontSize: fontSize,
                fontWeight: fontWeight,
                buttonSize: buttonSize,
                colorTheme: colorTheme
            });
        } catch (error) {
            console.error("Error saving user settings:", error);
        }
    };

    return (
        <Flex width={"100vw"}>
            <StickyButtonContainer>
                <IconButton
                    onClick={() => setIsOpen(true)}
                    icon={<SettingsIcon />}
                    aria-label="Settings"
                    borderRadius="full"
                    fontSize="30px"
                    height={"60px"}
                    opacity={(isOpen) ? "80%" : "100%"}
                    width={"60px"}
                    boxShadow="0px 0 6px rgba(0, 0, 0, 0.7)"
                />
            </StickyButtonContainer>
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent alignSelf={"center"} mt={2} pt={2} maxW={{ base: "95%", md: "80%" }}>
                    <ModalHeader textAlign={"center"} fontWeight={"bold"} pb={0} fontSize={"2xl"}>Accessibility Settings</ModalHeader>
                    <ModalBody>
                        <VStack px={{ base: 0, md: 4 }} spacing={4} align="stretch">
                            <Box>
                                <Text fontSize="xl" mb={1} fontWeight="semibold"> 
                                    Text Size
                                </Text>
                                <RadioGroup
                                    value={fontSize}
                                    onChange={(value) => setFontSize(value)}
                                >
                                    <Stack direction={{base: "column", md: "row"}}>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="1"><Text fontSize={"24px"} fontWeight={"500"}>Small</Text></Radio>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="1.2"><Text fontSize={"24px"} fontWeight={"500"}>Medium</Text></Radio>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="1.4"><Text fontSize={"24px"} fontWeight={"500"}>Large</Text></Radio>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="1.6"><Text fontSize={"24px"} fontWeight={"500"}>Largest</Text></Radio>
                                    </Stack>
                                </RadioGroup>
                            </Box>

                            <Box>
                                <Text fontSize="xl"  mb={1} fontWeight="semibold">
                                    Text Weight
                                </Text>
                                <RadioGroup
                                    value={fontWeight}
                                    onChange={(value) => setFontWeight(value)}
                                >
                                    <Stack direction="row">
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="400"><Text fontSize={"24px"} fontWeight={"500"}>Normal</Text></Radio>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="500"><Text fontSize={"24px"} fontWeight={"500"}>Bold</Text></Radio>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="600"><Text fontSize={"24px"} fontWeight={"500"}>Bolder</Text></Radio>
                                    </Stack>
                                </RadioGroup>
                            </Box>

                            {/* <Box>
                                <Text fontSize="lg" fontWeight="semibold">
                                    Button Sizes
                                </Text>
                                <RadioGroup
                                    value={buttonSize}
                                    onChange={(value) => setButtonSize(value)}
                                >
                                    <Stack direction="row">
                                        <Radio value="1">Standard</Radio>
                                        <Radio value="2">Larger</Radio>
                                    </Stack>
                                </RadioGroup>
                            </Box> */}

                            <Box>
                                <Text fontSize="xl" mb={1} fontWeight="semibold">
                                    Color Theme
                                </Text>
                                <RadioGroup
                                    value={colorTheme}
                                    onChange={(value) => setColorTheme(value)}
                                >
                                    <Stack direction="row">
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="cof"><Text fontSize={"24px"} fontWeight={"500"}>Mocha</Text></Radio>
                                        <Radio pl="8px" sx={{ width: "26px", height: "26px", borderRadius: "full" }} value="per"><Text fontSize={"24px"} fontWeight={"500"}>Periwinkle</Text></Radio>
                                    </Stack>
                                </RadioGroup>
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

export default Settings;