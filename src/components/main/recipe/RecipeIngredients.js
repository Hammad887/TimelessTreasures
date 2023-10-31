// RecipeIngredients.js

import React, { useState } from "react";

import {
    FormLabel,
    HStack,
    IconButton,
    Input,
    VStack,
    useBreakpointValue
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";

import DeleteButton from "../DeleteButton";

const RecipeIngredients = ( { alertErrors, ingredients, setIngredients } ) => {

    const columns = useBreakpointValue({ base: 1, md: 1 });
    const [isOpen, setIsOpen] = useState(false);

    const insertIngredient = (index) => {
        setIngredients((prevIngredients) => {
            const newIngredients = [
                ...prevIngredients.slice(0, index + 1),
                {
                    id: prevIngredients[index].id + 1,
                    amount: "",
                    unit: "",
                    name: "",
                },
                ...prevIngredients.slice(index + 1),
            ];
            return newIngredients.map((ingredient, idx) => ({ ...ingredient, id: idx + 1 }));
        });
    };
        
    const addIngredient = () => {
        setIngredients((prevIngredients) => [
        ...prevIngredients,
        {
            id: prevIngredients[prevIngredients.length - 1].id + 1,
            amount: "",
            unit: "",
            name: "",
        },
        ]);
    };
    
    const removeIngredient = (id) => {
        setIngredients((prevIngredients) => {
            const newIngredients = prevIngredients.filter(
                (ingredient) => ingredient.id !== id
            );
            return newIngredients.map((ingredient, index) => ({
                ...ingredient,
                id: index + 1,
            }));
        });
    };
    
    const updateIngredient = (id, field, value) => {
        setIngredients((prevIngredients) =>
        prevIngredients.map((ingredient) =>
            ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
        )
        );
    };

    return (
        <VStack spacing={2}>

            { (alertErrors.includes("ingredients") ) ?
                <FormLabel fontSize="xl" mb={1} fontWeight="semibold" color={"red"}>Ingredients (please fill out at least one)</FormLabel>
            :
                <FormLabel fontSize="xl" mb={1} fontWeight="semibold">Ingredients</FormLabel>
            }

            {ingredients.map((ingredient, index) => (
                <HStack key={ingredient.id} width="100%" alignItems="center">
                    <Input
                        value={ingredient.amount}
                        fontWeight={"normal"}
                        onChange={(e) =>
                            updateIngredient(ingredient.id, "amount", e.target.value)
                        }
                        min={0}
                        maxW="60px"
                        textAlign="center"
                        placeholder="0"
                        size="lg"
                    />
                    <Input
                        value={ingredient.unit}
                        fontWeight={"normal"}
                        onChange={(e) =>
                            updateIngredient(ingredient.id, "unit", e.target.value)
                        }
                        placeholder="Unit"
                        padding="0.5rem"
                        maxW="70px"
                        textAlign="center"
                        size="lg"
                    />
                    <Input
                        flex={1}
                        fontWeight={"normal"}
                        value={ingredient.name}
                        onChange={(e) =>
                            updateIngredient(ingredient.id, "name", e.target.value)
                        }
                        placeholder="Ingredient"
                        size="lg"
                    />
                    <HStack spacing={2} alignItems="center">

                        {ingredients.length > 1 && ( 
                            <DeleteButton aria={"ingredient"} removeStep={removeIngredient} id={ingredient.id} />
                        )}

                        <IconButton
                            aria-label="Add ingredient"
                            icon={<AddIcon />}
                            onClick={() => insertIngredient(index)}
                            size={(ingredients.length > 1) ? "sm" : "md"}
                        />
                    
                    </HStack>
                </HStack>
            ))}
        </VStack>
    );
}

export default RecipeIngredients;