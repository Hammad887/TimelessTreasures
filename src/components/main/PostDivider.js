// we don't talk about this file

// import { deleteDoc, doc, getDoc, collection, addDoc } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { v4 as uuid } from 'uuid';

// import {
//     AlertDialog,
//     AlertDialogBody,
//     AlertDialogContent,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogOverlay,
//     Box,
//     Button,
//     Checkbox,
//     Flex,
//     HStack,
//     Heading,
//     Image,
//     Modal,
//     ModalOverlay,
//     SimpleGrid,
//     Text,
//     VStack,
//     useToast
// } from "@chakra-ui/react";

// import Navbar from '../Navbar';

// import { auth, db } from '../../../firebase';
// import CommentSection from '../comments/CommentSection';

// import FlexPhoneOrNot from '../FlexPhoneOrNot';
// import UserInfoInPost from '../UserInfoInPost';
// import EditRecipe from './EditRecipe';

// import { useUser } from '../../../UserContext';

// const PostDivider = () => {

//     const { id } = useParams();
//     const [recipe, setRecipe] = useState(null);

//     const { user, setUser } = useUser();

//     const [editing, setEditing] = useState(false);
//     const [deleting, setDeleting] = useState(false);
//     const [actuallyEdited, setActuallyEdited] = useState(false);

//     useEffect(() => {
//         const fetchRecipe = async () => {
//             const recipeRef = doc(db, 'recipes', id);
//             const recipeSnapshot = await getDoc(recipeRef);
//             if (recipeSnapshot.exists()) {
//                 setRecipe(recipeSnapshot.data());
//             }
//         };

//         fetchRecipe();
//     }, [id, actuallyEdited]);

//     const navigate = useNavigate();
//     const cancelRef = React.useRef()

//     const deleteRecipe = async (id) => {
//         try {
//             const recipeRef = doc(db, 'recipes', id);
//             await deleteDoc(recipeRef);
//             console.log('Recipe successfully deleted.');
//             navigate('/recipes');
//         } catch (error) {
//             console.error('Error deleting recipe:', error);
//         }
//     };

//     const toast = useToast();

//     const submitReport = async () => {
//         try {

//             const reportData = { type: "recipepost", id: id, title: recipe.title, description: recipe.description, image: recipe.mainImage, ingredients: recipe.ingredients, steps: recipe.steps, poster: recipe.user }

//             const feedbackRef = collection(db, 'reports');
//             await addDoc(feedbackRef, reportData);

//             toast({
//                 title: 'Report sent!',
//                 description: 'Thank you for reporting the post and keeping the community safe & respectful to all.',
//                 status: 'success',
//                 duration: 6000,
//                 isClosable: true,
//             });
//         } catch (error) {
//             console.log(error);
//             toast({
//                 title: 'Error sending report',
//                 description: 'Something went wrong, please try again later.',
//                 status: 'error',
//                 duration: 6000,
//                 isClosable: true,
//             });
//         }
//     };

//     return (
//         <Flex bg="orange.50">
//             <Box>
//                 {(!sameUser) ?
//                     <HStack mb={"20px"} justifyContent={"center"}>
//                         <Button onClick={submitReport} colorScheme="gray" color={"red"} height={"26px"} size="md">
//                             Report Recipe
//                         </Button>
//                     </HStack>
//                     : null
//                 }
//             </Box>
//         </Flex>
//     );
// };

// export default PostDivider;


