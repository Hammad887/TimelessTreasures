import {
    Box,
    Button,
    Flex,
    Heading,
    VStack,
    Text,
    Image,
    useColorModeValue
} from '@chakra-ui/react';

const InterestCard = ({ src, alt, isSelected, onClick }) => {
    const borderColor = useColorModeValue('gray.300', 'gray.600');
    const hoverBgColor = useColorModeValue('gray.200', 'gray.700');
    const selectedBorderColor = useColorModeValue('blue.500', 'blue.300');

    return (
        <VStack spacing={0}>
            <Box
                borderWidth={isSelected ? '2px' : '1px'}
                borderColor={isSelected ? selectedBorderColor : borderColor}
                borderRadius="md"
                overflow="hidden"
                position="relative"
                width={"16vw"}
                height={"16vw"}
                maxW={"16vh"}
                maxH={"16vh"}
                onClick={onClick}
                _hover={{
                    bg: hoverBgColor,
                }}
            >
                <Image src={src} alt={alt} objectFit="contain" />
                {isSelected && (
                    <Box
                        position="absolute"
                        top="0"
                        right="0"
                        mt="1"
                        mr="1"
                        backgroundColor={selectedBorderColor}
                        borderRadius="full"
                        color="white"
                        fontWeight="bold"
                        fontSize="sm"
                        px="1"
                    >
                        ✓
                    </Box>
                )}
            </Box>
            <Text fontWeight={{base: "500", sm: "600"}} fontSize={{ base: "13px", sm: "19px" }}>{alt.slice(0, 1).toUpperCase() + alt.substring(1)}</Text>
        </VStack>
    );
};

export default InterestCard;