import { Box, Link as ChakraLink, Flex, Image, Text } from "@chakra-ui/react";

const Socials = ({ imagePath, href }) => {
    return (
        <ChakraLink href={href}>
            <Image
                transition=".3s ease-out"
                _hover={{ transform: "scale(1.2)" }}
                mr=".7rem"
                cursor="pointer"
                src={imagePath}
            />
        </ChakraLink>
    );
};

const FooterLink = ({ href, children }) => {
    return (
        <Box>
            <ChakraLink href={href} d="block" mb=".5rem" color="brand.footerGrey">
                {children}
            </ChakraLink>
        </Box>
    );
};

const Footer = () => {
    return (
        <Box
            pt="3rem"
            pb="3rem"
            mt={{ base: 0, md: "4rem" }}
            // backgroundColor="#F5C281"
            bg={'linear-gradient(180deg, #E2B275, #E7B474)'}
            as="footer"
            boxShadow="4px 0 8px rgba(0, 0, 0, 0.5)" 
        >
            <Flex
                justify="center"
                flexDir={{ base: "column", md: "row" }}
                gridRowGap="2rem"
            >
                <Box
                    textAlign="center"
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                >
                    <ChakraLink href="#!">
                        <Image
                            mb="1.5rem"
                            src="./logo.png"
                            maxWidth="120px"
                        />
                    </ChakraLink>
                    <Text mb="1.2rem" fontSize="27px" fontWeight={"500"} color="brand.footerGrey">
                        Preserving the Past, Inspiring the Future
                    </Text>
                    <Text fontSize={"17px"} fontWeight={"500"} color="brand.footerGrey">
                        Copyright © 2023 Timeless Treasures. All Rights Reserved
                    </Text>
                </Box>
            </Flex>
            {/* <Flex justify="center" align="center">
                <Socials
                    href="#!"
                    imagePath="https://res.cloudinary.com/djksghat4/image/upload/v1606868551/chakra/twitter.svg"
                />
                <Socials
                    href="#!"
                    imagePath="https://res.cloudinary.com/djksghat4/image/upload/v1606868551/chakra/facebook.svg"
                />
                <Socials
                    href="#!"
                    imagePath="https://res.cloudinary.com/djksghat4/image/upload/v1606868551/chakra/instagram.svg"
                />
                <Socials
                    href="#!"
                    imagePath="https://res.cloudinary.com/djksghat4/image/upload/v1606868551/chakra/linkedin.svg"
                />
                <Socials
                    href="#!"
                    imagePath="https://res.cloudinary.com/djksghat4/image/upload/v1606868551/chakra/youtube.svg"
                />
            </Flex> */}
        </Box>
    );
};

export default Footer;
