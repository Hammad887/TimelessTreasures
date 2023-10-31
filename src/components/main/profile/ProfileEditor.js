import {
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Image,
    Input,
    InputGroup,
    ModalBody,
    ModalFooter,
    Text,
    Textarea,
    VStack
} from "@chakra-ui/react";
import React, { useState } from "react";

import { v4 as uuid } from 'uuid';

import defaultPFP from "../../../assets/defaultPFP.jpg";

import { MdHideImage, MdImage } from "react-icons/md";

import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../../../firebase";

const ProfileEditor = ({ uid, profile, onProfileUpdate, onClose }) => {
    const [name, setName] = useState(profile.name);
    const [bio, setBio] = useState(profile.bio);
    const [isUpdating, setIsUpdating] = useState(false);
    const [pfp, setPFP] = useState(null);
    const [pfpURL, setPFPURL] = useState(profile.pfpURL);

    const handleUpdate = async () => {
        setIsUpdating(true);

        let imageURL = pfpURL;

        if (pfp) {
            imageURL = await uploadImage(pfp);
        }

        const updatedProfile = {
            ...profile,
            name,
            bio,
            pfpURL: imageURL
        };

        await updateDoc(doc(db, "users", uid), updatedProfile);
        onProfileUpdate(updatedProfile);
        setIsUpdating(false);
    };

    const uploadImage = async (imageFile) => {
        const storage = getStorage();
        const uniqueImageFile = uuid();
        const storageRef = ref(storage, `images/${uid}/${uniqueImageFile}`);
        await uploadBytes(storageRef, imageFile);
        const imageURL = await getDownloadURL(storageRef);
        return imageURL;
    };

    const handleAddPFPImage = (e) => {
        const file = e.target.files[0];
        setPFPURL(URL.createObjectURL(e.target.files[0]));
        setPFP(e.target.files[0]);
    };

    return (
        <>
            <ModalBody>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel fontSize="xl" mb={1} fontWeight="semibold">Display Name</FormLabel>
                        <Input
                            value={name}
                            size={"lg"}
                            fontWeight={"normal"}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Display Name"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel fontSize="xl" mb={1} fontWeight="semibold">Profile Picture</FormLabel>

                        <Image
                            src={pfpURL || defaultPFP}
                            alt="Profile picture"
                            boxSize="100px"
                            borderRadius="full"
                            objectFit="cover" 
                            ml={"10px"}
                            boxShadow={"xl"}
                        />
                        
                        <Box pt={"11px"}>
                            <InputGroup pb={'7px'} alignItems="flex-end">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    id="lmao_why_are_you_looking_at_my_code"
                                    onChange={(e) => {handleAddPFPImage(e)}}
                                />
        
                            {pfpURL ? (
                                <IconButton
                                    aria-label="Remove image"
                                    pl="8px"
                                    pr="8px"
                                    icon={<HStack><MdHideImage /><Text>Remove Image</Text></HStack>}
                                    onClick={() => {setPFP(""); setPFPURL("")}} 
                                    size="sm"
                                />
                                ) : (
                                <IconButton
                                    aria-label="Add an image to a step"
                                    pl="8px"
                                    pr="8px"
                                    icon={<HStack><MdImage /><Text>Add A Main Image</Text></HStack>}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(`lmao_why_are_you_looking_at_my_code`).click();
                                    }}
                                    size={"sm"}
                                />
                            )}
                            </InputGroup>
                        </Box>
                    </FormControl>
                    <FormControl>
                        <FormLabel fontSize="xl" mb={1} fontWeight="semibold">Short Bio</FormLabel>
                        <Textarea
                            h={"5em"}
                            size={"lg"}
                            fontWeight={"normal"}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Bio"
                        />
                    </FormControl>
                </VStack>
            </ModalBody>

            <ModalFooter mb={4} width={"100%"} justifyContent={"center"}>
                <Button
                    fontSize={"xl"}
                    width={"100%"} 
                    colorScheme="blue"
                    onClick={handleUpdate}
                    isLoading={isUpdating}
                    disabled={isUpdating}
                >
                    Save Changes
                </Button>
                <Button fontSize={"xl"}  width={"100%"} ml={2} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }}  onClick={() => onClose()}>Cancel</Button>
            </ModalFooter>
        </>
    );
};

export default ProfileEditor;