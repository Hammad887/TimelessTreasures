import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    HStack,
    Heading,
    IconButton,
    Image,
    Input,
    Select,
    Stack,
    Text,
    VStack,
    useToast
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";

import { db } from "../../firebase.js";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { MdHideImage, MdImage } from "react-icons/md";
import { v4 as uuid } from 'uuid';

import baking from "../../assets/baking.png";
import cooking from "../../assets/cooking.png";
import creating from "../../assets/creating.png";
import engineering from "../../assets/engineering.png";
import family from "../../assets/family.png";
import film from "../../assets/film.png";
import gardening from "../../assets/gardening.png";
import storytelling from "../../assets/storytelling.png";
import traveling from "../../assets/traveling.png";
import writing from "../../assets/writing.png";

import defaultPFP from "../../assets/defaultPFP.jpg";

import InterestCard from './InterestCard';

const interestsList = [
    'gardening',
    'creating',
    'family',
    'engineering',
    'storytelling',
    'cooking',
    'baking',
    'traveling',
    'writing',
    'film',
];

const Onboarding = ( { setOnboarded } ) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUser(user.uid);
        }
    }, []);

    const [requirement, setRequirement] = useState("");

    const [uploading, setUploading] = useState(false);

    const toast = useToast();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [interests, setInterests] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = getAuth();

    const toggleInterest = (interest) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter((i) => i !== interest));
        } else {
            setInterests([...interests, interest]);
        }
    };

    const tryNextStep = () => {
        if (step === 1 && name.trim()) {
            setStep(step + 1);
            setRequirement("");
        } else if (step === 2 && !ageRange.trim()) {
            setRequirement("age");
        } else if (step != 1) {
            setStep(step + 1);
            setRequirement("");
        } else {
            setRequirement("name");
        }
    };

    const [pfp, setPFP] = useState(null);
    const [pfpURL, setPFPURL] = useState(null);

    const uploadImage = async (imageFile) => {
        const storage = getStorage();
        const uniqueImageFile = uuid();
        const storageRef = ref(storage, `images/${user}/${uniqueImageFile}`);
        await uploadBytes(storageRef, imageFile);
        const imageURL = await getDownloadURL(storageRef);
        return imageURL;
    };

    const handleAddPFPImage = (e) => {
        const file = e.target.files[0];
        setPFPURL(URL.createObjectURL(e.target.files[0]));
        setPFP(e.target.files[0]);
    };

    const isValidUsername = (username) => {
        const pattern = /^[a-zA-Z0-9_-]+$/;
        const testpattern = pattern.test(username);
        return testpattern && username.length > 3
    };

    const usernameExistsCheck = async (username) => {
        try {
            const docRef = doc(db, 'usernames', username);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.exists());
            return docSnap.exists();
        } catch (error) {
            console.error('Error checking username:', error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step === 5 && !uploading) {
            setUploading(true);

            const pattern = /^[a-zA-Z0-9_-]+$/;

            const checkExist = await usernameExistsCheck(username);

            if (!username) {
                setRequirement("usernamereq");
                setUploading(false);
            } else if (!isValidUsername(username.trim())) {
                setRequirement("usernamebad");
                setUploading(false);
            } else if (checkExist) {
                setRequirement("usernameexists");
                setUploading(false);
            } else {
    
                setRequirement("");
                try {
                    console.log('User created successfully');

                    let pfpURLToSave = null;
                    if (pfp) {
                        pfpURLToSave = await uploadImage(pfp);
                    }

                    console.log(pfpURLToSave);

                    const userData = {
                        name,
                        ageRange,
                        interests,
                        pfpURL: pfpURLToSave,
                        bio: "",
                        connectons: [],
                        uid: user,
                        username
                    };

                    await setDoc(doc(db, "users", user), userData);

                    const usernameData = {
                        username
                    }

                    await setDoc(doc(db, "usernames", username), usernameData);
                    setUploading(false);
                    console.log("User data saved successfully");
                    setOnboarded(true);
                    navigate("/");

                } catch (error) {
                    console.error('Error creating user:', error.message);
                    setUploading(false);
                }
            }
        } else {
            setUploading(false);
            setStep(step + 1);
        }
    };

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={
            step === 1 ? 'step1' :
            step === 2 ? 'step2' :
            step === 3 ? 'step3' :
            step === 4 ? 'step4' :
            step === 5 ? 'step5' :
            'inherit'
        }>
            <Box p={6} width="100%" maxWidth="500px" mx="auto">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        {step === 1 && (
                            <>
                                <Heading fontSize={"4xl"} fontWeight="semibold" textAlign={'center'}>
                                    Hello! Welcome to Timeless Treasures.
                                </Heading>
                                <FormControl pt={2}>
                                    {(requirement === "name") ?
                                        <FormLabel fontWeight={"semibold"} fontSize={"xl"} textColor={"red"}>Name (Required)</FormLabel>
                                        :
                                        <FormLabel fontWeight={"semibold"} fontSize={"xl"}>Name</FormLabel>
                                    }
                                    <Input
                                        bg={"white"}
                                        type="text"
                                        size={"lg"}
                                        fontSize={"xl"}
                                        fontWeight={"normal"}
                                        value={name}
                                        placeholder="Enter your name. Nicknames are ok!"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </FormControl>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <Heading fontSize={"3xl"} fontWeight="semibold" textAlign={'center'}>
                                    Choose the age range that you identify with.
                                </Heading>
                                <Text fontSize={"xl"} fontWeight={"normal"} textAlign={'center'}>This helps others in the community identify with you better!</Text>
                                <FormControl>
                                    {(requirement === "age") ?
                                        <FormLabel fontWeight={"semibold"} fontSize={"xl"} textColor={"red"}>Age Range (Required)</FormLabel>
                                        :
                                        <FormLabel fontWeight={"semibold"} fontSize={"xl"}>Age Range</FormLabel>
                                    }
                                    <Select
                                        bg={"white"}
                                        type="text"
                                        size={"lg"}
                                        fontSize={"xl"}
                                        fontWeight={"normal"}
                                        bg={"white"}
                                        value={ageRange}
                                        onChange={(e) => setAgeRange(e.target.value)}
                                        required
                                    >
                                        <option value="">Select age range</option>
                                        <option value="Under 18">Under 18</option>
                                        <option value="18-24">18-24</option>
                                        <option value="25-34">25-34</option>
                                        <option value="35-44">35-44</option>
                                        <option value="45-54">45-54</option>
                                        <option value="55-64">55-64</option>
                                        <option value="65-74">65-74</option>
                                        <option value="75-84">75-84</option>
                                        <option value="85-94">85-94</option>
                                        <option value="94+">94+</option>
                                    </Select>
                                </FormControl>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <Heading fontSize={"2xl"} fontWeight="semibold" textAlign={"center"}>
                                    Timeless Treasures offers various communities and niches.
                                </Heading>
                                <Text fontSize={"xl"} fontWeight={"normal"} textAlign={'center'}>Please select any you may be interested in!</Text>
                                <Grid templateColumns="repeat(5, 1fr)" gap={2}>
                                    {interestsList.map((interest, index) => (
                                        <InterestCard
                                            src={
                                                interest === 'traveling'
                                                    ? traveling
                                                    : interest === 'gardening'
                                                        ? gardening
                                                        : interest === 'creating'
                                                            ? creating
                                                            : interest === 'family'
                                                                ? family
                                                                : interest === 'engineering'
                                                                    ? engineering
                                                                    : interest === 'storytelling'
                                                                        ? storytelling
                                                                        : interest === 'baking'
                                                                            ? baking
                                                                            : interest === 'writing'
                                                                                ? writing
                                                                                : interest === 'cooking'
                                                                                    ? cooking
                                                                                    : interest === 'film'
                                                                                        ? film
                                                                                        : null
                                            }
                                            alt={interest}
                                            key={interest}
                                            isSelected={interests.includes(interest)}
                                            onClick={() => toggleInterest(interest)}
                                        />
                                    ))}
                                </Grid>
                            </>
                        )}

                        {step === 4 && (
                            <Box align="center">
                                 <Heading fontSize={"2xl"} fontWeight="semibold" textAlign={'center'}>
                                    Add a profile picture
                                </Heading>
                                <Flex mt={"20px"} justifyContent={"center"} alignItems={"center"}>
                                    <FormControl>
                                        <Image
                                            src={pfpURL || defaultPFP}
                                            alt="Profile picture"
                                            boxSize="100px"
                                            borderRadius="full"
                                            objectFit="cover"
                                            mb={"20px"}
                                        />
                                        <Box alignItems="center">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                id="profilepicture"
                                                onChange={(e) => { handleAddPFPImage(e) }}
                                            />

                                            {pfpURL ? (
                                                <IconButton
                                                    aria-label="Remove image"
                                                    pl="8px"
                                                    pr="8px"
                                                    icon={<HStack><MdHideImage /><Text>Remove Image</Text></HStack>}
                                                    onClick={() => { setPFP(""); setPFPURL("") }}
                                                    size="sm"
                                                />
                                            ) : (
                                                <IconButton
                                                    aria-label="Add an image to a step"
                                                    pl="8px"
                                                    pr="8px"
                                                    icon={<HStack><MdImage /><Text>Select Image</Text></HStack>}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        document.getElementById(`profilepicture`).click();
                                                    }}
                                                    size={"sm"}
                                                />
                                            )}
                                        </Box>
                                    </FormControl>
                                </Flex>
                            </Box>
                        )}

                        {step === 5 && (
                            <>
                                <Heading fontSize={"2xl"} fontWeight="semibold" textAlign={"center"}>
                                    Lastly, before you join, please select a unique username!
                                </Heading>
                                <FormControl>
                                    {(requirement === "usernamereq") && <FormLabel fontWeight={"semibold"} fontSize={"xl"} textColor={"red"}>Username (Required)</FormLabel>}
                                    {(requirement === "usernamebad") && <FormLabel fontWeight={"semibold"} fontSize={"xl"} textColor={"red"}>Username (Badly Formatted)</FormLabel>}
                                    {(requirement === "usernameexists") && <FormLabel fontWeight={"semibold"} fontSize={"xl"} textColor={"red"}>Username (Already Exists)</FormLabel>}
                                    {(requirement === "") && <FormLabel fontWeight={"semibold"} fontSize={"xl"}>Username</FormLabel>}

                                    <Input
                                        bg={"white"}
                                        type="text"
                                        size={"lg"}
                                        fontSize={"xl"}
                                        fontWeight={"normal"}
                                        value={username}
                                        placeholder="Choose a username. No spaces or puncutuation."
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </FormControl>
                            </>
                        )}

                        <Stack width={"100%"} spacing={10} pt={5}>
                            <HStack>
                                <Button
                                    onClick={() => {
                                        setStep(step - 1);
                                    }}
                                    isDisabled={step === 1}
                                    fontSize={"xl"}
                                    fontWeight={"semibold"}
                                    height={"42px"} 
                                    size="lg"
                                    colorScheme="blue"
                                    width={"100%"}
                                    colorScheme="blue"
                                    variant="outline"
                                    mr={2}
                                >
                                    Back
                                </Button>
                                {step !== 5 ? (
                                    <Button
                                        fontSize={"xl"}
                                        fontWeight={"semibold"}
                                        height={"42px"} 
                                        size="lg"
                                        colorScheme="blue"
                                        width={"100%"}
                                        onClick={() => {
                                            tryNextStep();
                                        }}
                                        colorScheme="blue"
                                        variant="solid"
                                    >
                                        Next
                                    </Button>
                                ) : null}
                                {step === 5 && (
                                    <Button
                                        fontSize={"xl"}
                                        fontWeight={"semibold"}
                                        height={"42px"} 
                                        size="lg"
                                        colorScheme="blue"
                                        width={"100%"}
                                        type="submit"
                                        colorScheme="red"
                                        variant="solid"
                                        onClick={handleSubmit}
                                        disabled={uploading}
                                    >
                                        Submit
                                    </Button>
                                )}
                            </HStack>
                        </Stack>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
};

export default Onboarding;






