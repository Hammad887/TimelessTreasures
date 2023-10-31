import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
    Box,
    Collapse,
    Flex,
    HStack,
    IconButton,
    Spacer,
    Stack,
    Text,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import { Link, useNavigate } from 'react-router-dom';

export default function Navbar( { toneDownShadow } ) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    return (
        <Flex top={0} position={"relative"} width={"100%"}>
            <Box 
                color={"blackAlpha.900"}
                position={"relative"}
                top={0}
                zIndex={1}
                boxShadow={ toneDownShadow ? "0px 4px 8px rgba(0, 0, 0, 0.5)" : "0px 10px 8px rgba(0, 0, 0, 0.5)"}  
                width={"100%"}
                bg={'linear-gradient(180deg, #DCA357, #E5AC68)'}
                px={4}
            >
                <Flex width={"100%"} h={"70px"} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        fontSize="3xl"
                        ml={"2px"}
                        pb={"4px"}
                        icon={isOpen ? <CloseIcon mb={"9px"} fontSize={"26px"} /> : <HamburgerIcon mb={"9px"} fontSize={"36px"} />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                        variant="ghost"
                        _hover={{ bg: "orange.200" }}
                    />
                    <HStack width={{ md: "100%" }} alignItems={'center'}>

                        <HStack
                            paddingLeft={5}
                            fontSize={"23px"}
                            height="100%"
                            display={{ base: "flex", md: "none" }}
                        >
                            <VStack ml={'-10px'} fontWeight={"semibold"} spacing={-3.5}>
                                <Text>
                                    Treasures
                                </Text>
                                <Text>
                                    Timeless
                                </Text>
                            </VStack>

                            <img
                                src="/favnav.png"
                                alt="Logo"
                                style={{ height: "auto", width: "46px" }}
                            />
                        </HStack>

                        <HStack
                            height="100%"
                            fontSize={"23px"}
                            display={{ base: "none", md: "flex" }}
                        >
                            <img
                                src="/favnav.png"
                                alt="Logo"
                                style={{ height: "auto", width: "46px" }}
                            />
                            <VStack ml={'-10px'} fontWeight={"semibold"} spacing={-3.5}>
                                <Text>
                                    Treasures
                                </Text>
                                <Text>
                                    Timeless
                                </Text>
                            </VStack>
                        </HStack>

                        <HStack
                            pl={{ base: "0px", md: "50px" }}
                            width={"100%"}
                            as={'nav'}
                            spacing={6}
                            fontWeight={"600"}
                            fontSize={"27px"}
                            display={{ base: 'none', md: 'flex' }}>

                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to={`/`}>
                                    <Text textAlign="center">Home</Text>
                                </Link>
                            </Box>

                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Link to={`/about`}>
                                    <Text textAlign="center">About</Text>
                                </Link>
                            </Box>

                            <Spacer />
                            <Box pr={"15px"} align={"flex-end"} display="flex" flexDirection="column" alignItems="center">
                                <Link to={`/login`}>
                                    <Text textAlign="center">Sign In</Text>
                                </Link>
                            </Box>

                        </HStack>
                    </HStack>
                </Flex>

                {isOpen ? (
                    <Collapse in={isOpen}>
                        <Box mt={-1} pb={4} display={{ md: 'none' }}>
                            <Stack fontWeight={"600"} fontSize={"27px"} as={'nav'} spacing={1}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Link to={`/`}>
                                        <Text textAlign="center">Home</Text>
                                    </Link>
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Link to={`/about`}>
                                        <Text textAlign="center">About</Text>
                                    </Link>
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Link to={`/login`}>
                                        <Text textAlign="center">Sign In</Text>
                                    </Link>
                                </Box>
                            </Stack>
                        </Box>
                    </Collapse>
                ) : null}
            </Box>
        </Flex>
    );
}