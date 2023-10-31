import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    useDisclosure
} from '@chakra-ui/react';

import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

import Navbar from '../landing/Navbar';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [login_email, login_setEmail] = useState("");
    const [login_password, login_setPassword] = useState("");
    const [login_errors, login_setErrors] = useState(null);

    const navigate = useNavigate();

    async function handleLogin(e) {
        console.log("Form submitted");
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, login_email, login_password);
            console.log("Successfully logged in user:", userCredential.user);
            navigate('/')
        } catch (error) {
            console.error("Error logging in: ", error);
            login_setErrors("Error logging in: " + error.message);
        }
    };

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Flex
            minH={'100vh'}
            flexDirection={"column"}
            align={'center'}
            justify={'center'}
            bg={'orange.100'}
        >
            
            <Navbar toneDownShadow={true} onOpen={onOpen} />

            <Stack minHeight={"100vh"} pb={"80px"} spacing={8} mx={'auto'} maxW={'lg'} pt={"80px"} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize="32px" fontWeight={"bold"}>Login to your account</Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={'orange.50'}
                    boxShadow={'lg'}
                >
                    <Box>
                        {login_errors && <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle fontSize={"20px"}>Problem logging in.</AlertTitle>
                            <AlertDescription mt="2px" fontSize={"18px"} fontWeight={"500"}>Please recheck fields.</AlertDescription>
                        </Alert>}
                    </Box>
                    <Stack p={8} spacing={4}>
                        <form onSubmit={handleLogin}>
                            <FormControl id="email">
                                <FormLabel fontWeight={"600"} fontSize={"24px"}>Email Address</FormLabel>
                                <Input
                                    bg={"white"}
                                    type="email"
                                    size={"lg"}
                                    value={login_email}
                                    fontSize={"21px"}
                                    fontWeight={"400"}
                                    onChange={(e) => login_setEmail(e.target.value)}
                                    placeholder='enter your email address'
                                    required
                                />
                            </FormControl>
                            <FormControl mt={3} id="password">
                                <FormLabel fontWeight={"600"} fontSize={"24px"}>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        bg={"white"}
                                        size={"lg"}
                                        type={showPassword ? 'text' : 'password'}
                                        fontSize={"21px"}
                                        fontWeight={"400"}
                                        value={login_password}
                                        placeholder='enter your password'
                                        onChange={(e) => login_setPassword(e.target.value)}
                                        required
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
                            <Stack spacing={10}>
                                <Stack
                                    mt={"12px"}
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'center'}
                                    justify={'space-between'}
                                >
                                    <Checkbox mr={3} defaultChecked size={"lg"}>Remember me</Checkbox>
                                    <Link style={{ color: 'blue' }}><Text fontWeight={"500"} fontSize={"18px"}>Forgot password?</Text></Link>
                                </Stack>
                                <Button
                                    colorScheme='blue'
                                    fontSize={"24px"}
                                    fontWeight={"600"}
                                    height={"42px"} 
                                    size="lg"
                                    type='submit'
                                >
                                    Sign In
                                </Button>

                            
                            </Stack>
                            <Stack pt={6}>
                                <Text fontSize={"20px"} fontWeight={"600"} align={'center'}>
                                    Don't have an account yet? <Link style={{ color: 'blue' }} to="/signup" >Sign Up</Link>
                                </Text>
                            </Stack>
                        </form>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
export default Login;
