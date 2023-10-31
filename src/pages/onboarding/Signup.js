import {
    Alert,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    IconButton,
} from '@chakra-ui/react';

import { InfoOutlineIcon } from '@chakra-ui/icons';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";

import Navbar from '../landing/Navbar';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [signup_email, signup_setEmail] = useState("");
    const [signup_password, signup_setPassword] = useState("");
    const [signup_passwordConfirm, signup_setPasswordConfirm] = useState("");
    const [signup_errors, signup_setErrors] = useState(null);

    const [accessCode, setAccessCode] = useState("");

    const navigate = useNavigate();

    const { isOpen, onOpen, onClose } = useDisclosure();

    async function handleSubmit(e) {
        console.log("Form submitted");
        e.preventDefault();

        if (signup_password !== signup_passwordConfirm) {
            signup_setErrors("Passwords do not match.");
            return;
        }

        const check = await accessCodeCheck(accessCode);

        if (!check) {
            signup_setErrors("Incorrect access code.");
            return;
        }

        try {
            const { user } = await createUserWithEmailAndPassword(auth, signup_email, signup_password);
            console.log("Successfully created user!");
            const userID = user.uid;
            await setDoc(doc(db, "users", userID), {
                uid: userID,
            });
            navigate('/onboarding')
        } catch (error) {
            console.error("Error signing up.");
            signup_setErrors("Error signing up.")
        }
    }

    const accessCodeCheck = async (code) => {
        try {
            const docRef = doc(db, 'secrets', code);
            const docSnap = await getDoc(docRef);
            return docSnap.exists();
        } catch (error) {
            return false;
        }
    };

    const openInfoModal = () => {
        setIsInfoModalOpen(true);
    };

    const closeInfoModal = () => {
        setIsInfoModalOpen(false);
    };

    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    return (
        <Flex
            bg={'orange.100'}
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            flexDirection={"column"}
        >

            <Navbar toneDownShadow={true} onOpen={onOpen} />

            <Stack minHeight={"100vh"} spacing={8} mx={'auto'} minW={{base: '82vw', md: '50vw', lg: '40vw'}} maxW={"500px"} pt={12} pb={20} px={6}>

                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                </Stack>

                <Box
                    rounded={'lg'}
                    bg={'orange.50'}
                    boxShadow={'lg'}
                >
                    <Box>
                        {signup_errors && <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle fontSize={"20px"}>{signup_errors}</AlertTitle>
                        </Alert>}
                    </Box>
                    <Stack p={5} px={8} spacing={4}>
                        <form onSubmit={handleSubmit}>
                            <FormControl id="access_code" isRequired>
                                <FormLabel fontWeight={"600"} fontSize={"24px"}>Access Code</FormLabel>
                                <Flex>
                                    <Input
                                        bg={"white"}
                                        value={accessCode}
                                        size={"lg"}
                                        fontSize={"21px"}
                                        flex={1}
                                        fontWeight={"400"}
                                        placeholder='enter your code'
                                        onChange={(e) => setAccessCode(e.target.value)}
                                    />
                                    <IconButton
                                        aria-label="More information"
                                        fontSize={"22px"}
                                        height={"48px"}
                                        color={"gray.700"}
                                        width={"48px"}
                                        icon={<InfoOutlineIcon />}
                                        onClick={openInfoModal}
                                    />
                                </Flex>
                            </FormControl>
                            <FormControl pt={'10px'} id="email" isRequired>
                                <FormLabel fontWeight={"600"} fontSize={"24px"}>Email address</FormLabel>
                                <Input
                                    bg={"white"}
                                    type="email"
                                    size={"lg"}
                                    fontSize={"21px"}
                                    fontWeight={"400"}
                                    value={signup_email}
                                    placeholder='enter your email'
                                    onChange={(e) => signup_setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormControl pt={'10px'} id="password" isRequired>
                                <FormLabel fontWeight={"600"} fontSize={"24px"}>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        bg={"white"}
                                        size={"lg"}
                                        fontSize={"21px"}
                                        fontWeight={"400"}
                                        type={showPassword ? 'text' : 'password'}
                                        value={signup_password}
                                        placeholder='enter your password'
                                        onChange={(e) => signup_setPassword(e.target.value)}
                                    />
                                    <InputRightElement mr={1} h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() =>
                                                setShowPassword((showPassword) => !showPassword)
                                            }>
                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl pt={'10px'} id="passwordConfirm" isRequired>
                                <FormLabel fontWeight={"600"} fontSize={"24px"}>Confirm Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        bg={"white"}
                                        size={"lg"}
                                        fontSize={"21px"}
                                        fontWeight={"400"}
                                        type={showPassword ? "text" : "password"}
                                        value={signup_passwordConfirm}
                                        placeholder='enter your password again'
                                        onChange={(e) =>
                                            signup_setPasswordConfirm(e.target.value)
                                        }
                                    />
                                    <InputRightElement mr={1} h={"full"}>
                                        <Button
                                            variant={"ghost"}
                                            onClick={() =>
                                                setShowPassword((showPassword) => !showPassword)
                                            }
                                        >
                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Stack spacing={10} pt={5}>
                                <Button
                                    colorScheme='blue'
                                    fontSize={"24px"}
                                    fontWeight={"600"}
                                    height={"42px"} 
                                    size="lg"
                                    type='submit'
                                >
                                    Sign up
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text fontSize={"20px"} fontWeight={"600"} align={'center'}>
                                    Already a user? <Link style={{ color: 'blue' }} to="/login" >Login</Link>
                                </Text>
                            </Stack>
                        </form>
                    </Stack>
                </Box>
            </Stack>
            <AlertDialog
                isOpen={isInfoModalOpen}
                leastDestructiveRef={null}
                onClose={closeInfoModal}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="28px" fontWeight="bold">
                            Access Code Information
                        </AlertDialogHeader>
                        <AlertDialogBody fontSize={"22px"}>
                            Access code is required to sign up for an account. If you don't have one but would
                            like one, please email <b>access@timelesstreasures.app</b> for a code. Please
                            introduce yourself first though!
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button 
                                fontSize={"24px"}
                                fontWeight={"600"}
                                height={"42px"} 
                                size="lg"
                                colorScheme="blue"
                                width={"100%"}
                                mb={2}
                                onClick={closeInfoModal}
                            >
                                Close
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Flex>
    );
}
export default Signup;