import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Flex,
    Grid
} from '@chakra-ui/react';

import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';

import { db } from "../../../firebase.js";

import Masonry from 'react-masonry-css';
import '../../../styles/PostCardView.css';

import PostCard from './RecipePostCard.js';

import { v4 as uuid } from 'uuid';

const RecipePostCardsView = ({ addingCheck, filters }) => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    const [lastDoc, setLastDoc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const paginationSize = 200;

    const breakpointColumnsObj = {
        default: 3,
        1400: 2,
        900: 1,
        500: 1,
    };

    const fetchRecipes = async (lastVisibleDoc) => {
        if (!loading) {
            setLoading(true);
            const recipesRef = collection(db, 'recipes');

            let q;

            if (lastVisibleDoc) {
                q = query(recipesRef, orderBy('timestamp', 'desc'), startAfter(lastVisibleDoc), limit(paginationSize));
            } else {
                q = query(recipesRef, orderBy('timestamp', 'desc'), limit(paginationSize));
            }

            const querySnapshot = await getDocs(q);

            const docs = [];

            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });


            setRecipes(docs);

            // setRecipes((prevRecipes) => [...prevRecipes, ...docs]);
            // setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setLoading(false);

            if (querySnapshot.docs.length < paginationSize) {
                setHasMore(false);
            }
        }
    };

    useEffect(() => {
        fetchRecipes(null);
    }, [addingCheck]);

    const loadMore = () => {
        if (!loading) {
            fetchRecipes(null);
        }
    };

    useEffect(() => {
        console.log(filters);
        if (recipes && filters && (filters.origins.length > 0 || filters.ancestry != '' || filters.types.length > 0)) {
            const filtering = recipes.filter((recipe) => {
                
                if (recipe.view !== "public") {
                    return false;
                }
                
                if (filters.types && filters.types.length > 0 && !filters.types.some((type) => recipe.typesTag.includes(type))) {
                    return false;
                }
                
                if (filters.origins && filters.origins.length > 0 && !filters.origins.some((origin) => recipe.originsTag.includes(origin))) {
                    return false;
                }

                if (filters.ancestry && filters.ancestry.length > 0 && !filters.ancestry.some((ancestry) => recipe.ancestryTag.includes(ancestry))) {
                    return false;
                }

                return true;
            });

            setFilteredRecipes(filtering);
        } else {

            const filtering = recipes.filter((recipe) => {
                
                if (recipe.view !== "public") {
                    return false;
                }

                return true;
            });

            setFilteredRecipes(filtering);
        }

    }, [filters, recipes]);

    return (
        <Box>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
                rowClassName
            >
                {filteredRecipes.map((recipe) => (
                    <PostCard key={uuid()} recipe={recipe} />
                ))}
            </Masonry>
            <Flex justifyContent="center" my={4}>
                <Button bgColor={'gray.300'} onClick={loadMore} isDisabled={!hasMore}>
                    Load more
                </Button>
            </Flex>
        </Box>
    );
};

export default RecipePostCardsView;