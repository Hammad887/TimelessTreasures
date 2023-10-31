import { deleteDoc, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Checkbox,
    Flex,
    HStack,
    Heading,
    Image,
    Modal,
    ModalOverlay,
    SimpleGrid,
    Text,
    VStack,
    Divider,
} from "@chakra-ui/react";

import Votes from '../Votes';

import Navbar from '../Navbar';

import { auth, db } from '../../../firebase';
import CommentSection from '../comments/CommentSection';

import FlexPhoneOrNot from '../FlexPhoneOrNot';
import UserInfoInPost from '../UserInfoInPost';
import EditRecipe from './EditRecipe';

import ReportModal from '../ReportModal';

import { useUser } from '../../../UserContext';

const RecipePost = () => {

    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    const { user, setUser } = useUser();

    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [actuallyEdited, setActuallyEdited] = useState(false);
    
    const [reportModalOpen, setReportModalOpen] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            const recipeRef = doc(db, 'recipes', id);
            const recipeSnapshot = await getDoc(recipeRef);
            if (recipeSnapshot.exists()) {
                setRecipe(recipeSnapshot.data());
            }
        };

        fetchRecipe();
    }, [id, actuallyEdited]);

    const navigate = useNavigate();
    const cancelRef = React.useRef()

    const deleteRecipe = async (id) => {
        try {
            const recipeRef = doc(db, 'recipes', id);
            await deleteDoc(recipeRef);
            console.log('Recipe successfully deleted.');
            navigate('/recipes');
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    if (!recipe) return <Text>Loading...</Text>;

    return (
        <Flex bg="postBG" width={"100%"}>
            <FlexPhoneOrNot>
                <Box>
                    <Navbar />
                </Box>
                <Box mt={"6vh"} flex="1" width={"100%"}>

                    <ReportModal data={recipe} reportModalOpen={reportModalOpen} setReportModalOpen={setReportModalOpen} />

                    <Modal closeOnOverlayClick={false} isOpen={editing} onClose={() => setEditing(false)}>
                        <ModalOverlay />
                        <EditRecipe onClose={() => setEditing(false)} actuallyEdited={() => setActuallyEdited(!actuallyEdited)} recipeToEdit={recipe} />
                    </Modal>

                    <AlertDialog
                        closeOnOverlayClick={false}
                        isOpen={deleting}
                        leastDestructiveRef={cancelRef}
                        initialFocusRef={cancelRef}
                        onClose={() => setDeleting(false)}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent top={"21%"}>
                                <AlertDialogHeader fontWeight={"bold"} fontSize={"xl"} pb={"0px"}>Are you sure you want to delete your post?</AlertDialogHeader>
                                <AlertDialogBody fontWeight={"boldish"} fontSize={"lg"} pb={"0px"}>Deleted posts cannot be recovered.</AlertDialogBody>
                                <AlertDialogFooter mb={2} width={"100%"} justifyContent={"center"}>
                                    <Button width={"100%"} fontSize={"xl"} colorScheme="red" mr={3} onClick={() => deleteRecipe(recipe.recipeCode)}>Yes</Button>
                                    <Button width={"100%"} fontSize={"xl"} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }} autoFocus ref={cancelRef} onClick={() => setDeleting(false)}>No</Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>

                    {(recipe.user === user.uid) ?
                        <Box mb={5}>
                            <HStack justifyContent={"center"}>
                                <Button onClick={() => setEditing(true)} colorScheme="blue" height={"30px"} size="md">
                                    Edit Recipe
                                </Button>
                                <Button onClick={() => setDeleting(true)} colorScheme="red" height={"30px"} size="md">
                                    Delete Recipe
                                </Button>
                            </HStack>
                        </Box>
                        : null}

                    <Box>
                        <UserInfoInPost id={recipe.user} />
                    </Box>

                    <VStack>
                        <Heading textAlign="center" mt={2} size={"lg"}>{recipe.title}</Heading>
                        {(recipe.mainImage) ?
                            <Flex
                                width={"60vw"}
                                maxH={"60vw"}
                                maxW={"80vh"}
                                borderRadius="md"
                            >
                                <Image
                                    borderRadius="md"
                                    src={recipe.mainImage}
                                    alt={recipe.title}
                                    width="100%"
                                    objectFit="contain"
                                />
                            </Flex>
                            : null
                        }
                    </VStack>

                    <Box m={{ base: 4, md: 6 }}>
                        <Box borderTopColor={"postDividersBtwn"} borderTopWidth={"4px"} borderRadius={"xl"} p={3} boxShadow={"md"} bg={"postContentBG"}>
                            <Text fontWeight="semibold" fontSize="xl" px="1">
                                {recipe.description}
                            </Text>
                        </Box>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 2 }} m={{ base: 4, md: 6 }} spacing={{ base: 2, md: 4 }} templateColumns={{ base: "100%", md: "1fr 2fr" }}>
                        {/* Ingredients */}
                        <Box>
                            <Box borderTopColor={"postDividersBtwn"} borderTopWidth={"4px"} borderRadius={"xl"} p={3} boxShadow={"md"} bg={"postContentBG"}>
                                <Text fontWeight="bold" fontSize="2xl" mb={2} px="0.2rem">
                                    Ingredients
                                </Text>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <>
                                        <Box ml={{ base: 0, md: "10px" }} key={uuid()} display="flex" alignItems="center">
                                            <HStack alignItems={"center"}>
                                                <Checkbox mr="10px" size="lg" colorScheme="blue" />
                                                <Text fontWeight={"normal"} fontSize="xl" px="0.2rem">
                                                    {`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                                                </Text>
                                            </HStack>
                                        </Box>
                                        {(recipe.ingredients.length > 4) && index < recipe.ingredients.length - 1 && (
                                            <Divider orientation='vertical' h={"1.5px"} bg={"postDividersBtwn"} />
                                        )}
                                    </>
                                ))}
                            </Box>
                        </Box>

                        {/* Steps */}
                        <Box mt={{ base: 2, md: 0}}>
                            <Box borderTopColor={"postDividersBtwn"} borderTopWidth={"4px"} borderRadius={"xl"} p={3} boxShadow={"md"} bg={"postContentBG"}>
                                <Text fontWeight="bold" fontSize="2xl" mb={2} px={1}>
                                    Directions
                                </Text>
                                {recipe.steps.map((step, index) => (
                                    <>
                                        <Box px={1} lineHeight="1" key={uuid()}>
                                            <Text mt={(step.id > 1) ? "1rem" : "0.5rem"} fontSize="xl" px="0.2rem" display="flex">
                                                <Box whiteSpace="nowrap" display="inline-flex">
                                                    <Text fontWeight="semibold">Step {step.id}:</Text>&nbsp;
                                                </Box>
                                                <Box mb={2}>
                                                    <Text fontWeight={"normal"}>{step.content}</Text>
                                                    {step.imageURL && (
                                                        <VStack alignItems={"flex-start"} justifyContent="flex-start" pt="10px" width="100%">
                                                            <Flex maxH={"60vw"} maxW={"60vh"} borderRadius="md">
                                                                <Image
                                                                    key={step.imageURL}
                                                                    src={step.imageURL}
                                                                    width={"80vw"}
                                                                    objectFit="contain"
                                                                    borderRadius="sm"
                                                                />
                                                            </Flex>
                                                        </VStack>
                                                    )}
                                                </Box>
                                            </Text>
                                        </Box>
                                        {(recipe.steps.length > 4) && index < recipe.steps.length - 1 && (
                                            <Divider mt={2} orientation='vertical' h={"1.5px"} bg={"postDividersBtwn"} />
                                        )}
                                    </>
                                ))}
                            </Box>
                        </Box>
                    </SimpleGrid>

                    <Box mb={7} />
                    {/* <LikeShare postId={id} /> */}

                    <Box>
                        <Box mb={7}>

                            <Flex mb={5} justify={"center"}>
                                <Votes postPage={true} postId={recipe.recipeCode} postType={"recipes"} />
                            </Flex>

                            {(recipe.user === user.uid) ?
                                null
                                :
                                <HStack justifyContent={"center"}>
                                    <Button onClick={() => setReportModalOpen(true)} colorScheme="gray" color={"red"} height={"30px"} size="md">
                                        Report Recipe
                                    </Button>
                                </HStack>
                            }
                        </Box>
                        <CommentSection type="recipes" postId={id} />
                        <Box mb={20} />
                    </Box>

                </Box>
            </FlexPhoneOrNot>
        </Flex>
    );
};

export default RecipePost;


