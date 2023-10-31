import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Grid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalFooter,
    VStack,
    ModalHeader
} from '@chakra-ui/react';

import { collection, getDocs, orderBy, query, startAfter, where } from 'firebase/firestore';

import { db } from "../../../firebase.js";

import { v4 as uuid } from 'uuid';
import ChooseRecipePostCard from './ChooseRecipePostCard.js';

const ChooseRecipe = ({ uid, isOpen, onClose, shareRecipe }) => {
    const [recipes, setRecipes] = useState([]);

    const [loading, setLoading] = useState(false);

    const fetchRecipes = async () => {
        if (!loading) {
            setLoading(true);
            const recipesRef = collection(db, 'recipes');

            let q;

            q = query(
                recipesRef,
                where('user', '==', uid),
                orderBy('timestamp', 'desc'),
            );
    

            const querySnapshot = await getDocs(q);

            const docs = [];

            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });

            setRecipes(docs);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setRecipes([]);
            fetchRecipes();
        }
    }, [uid, isOpen]);

    const loadMore = () => {
        if (!loading) {
            fetchRecipes();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW={{ base: '90%', lg: '80%' }}>

                <ModalHeader pt={"30px"} pb={'0px'} textAlign="center">Select a Recipe From Your Recipebook</ModalHeader>

                <VStack spacing={4} p={4} pt={2}>
                    <Box
                        overflowY="auto"
                        maxH="65vh"
                        w="100%"
                        p={2}
                        pb={5}
                    >
                        <Grid
                            templateColumns={{
                                base: 'repeat(1, 1fr)',
                                md: 'repeat(1, 1fr)',
                                lg: 'repeat(2, 1fr)',
                                xl: 'repeat(2, 1fr)',
                            }}
                            gap={6}
                            alignItems="center"
                            justifyContent="center"
                            placeItems={'center'}
                        >
                            {recipes.map((recipe) => (
                                <ChooseRecipePostCard key={uuid()} recipe={recipe} shareRecipe={shareRecipe} />
                            ))}
                        </Grid>
                    </Box>
                </VStack>
                <ModalFooter mt={0} mb={"10px"}>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChooseRecipe;