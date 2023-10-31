import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Flex,
    Grid
} from '@chakra-ui/react';

import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../firebase.js";

import AdvicePostCard from './advice/AdvicePostCard.js';
import RecipePostCard from './recipe/RecipePostCard.js';
import StoryPostCard from './story/StoryPostCard.js';

import Masonry from 'react-masonry-css';
import '../../styles/PostCardView.css';

import { useUser } from '../../UserContext.js';

import { v4 as uuid } from 'uuid';

const HomeConnectionsPostCardView = () => {

    const { user, setUser } = useUser();

    const [connections, setConnections] = useState([]);

    useEffect(() => {
        if (user) {
            const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) {
                    setConnections(doc.data().connections || []);
                    fetchPosts(doc.data().connections);
                }
            });
    
            return () => {
                unsubscribe();
            };
        }
    }, [user]);

    const breakpointColumnsObj = {
        default: 3,
        1400: 2,
        900: 1,
        500: 1,
    };

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const paginationSize = 200;

    const fetchPosts = async (connections) => {
        if (!loading && connections.length > 0) {
            setLoading(true);

            const recipesRef = collection(db, 'recipes');
            const storiesRef = collection(db, 'stories');
            const adviceRef = collection(db, 'advice');

            const qRecipes = query(
                recipesRef,
                where('user', 'in', connections),
                orderBy('timestamp', 'desc'),
                limit(paginationSize)
            );

            const qStories = query(
                storiesRef,
                where('user', 'in', connections),
                orderBy('timestamp', 'desc'),
                limit(paginationSize)
            );

            const qAdvice = query(
                adviceRef,
                where('user', 'in', connections),
                orderBy('timestamp', 'desc'),
                limit(paginationSize)
            );

            const querySnapshots = await Promise.all([
                getDocs(qRecipes),
                getDocs(qStories),
                getDocs(qAdvice),
            ]);

            const allPosts = [];

            querySnapshots[0].forEach((doc) => {
                allPosts.push({ ...doc.data(), id: doc.id, type: 'recipe' });
            });

            querySnapshots[1].forEach((doc) => {
                allPosts.push({ ...doc.data(), id: doc.id, type: 'story' });
            });

            querySnapshots[2].forEach((doc) => {
                allPosts.push({ ...doc.data(), id: doc.id, type: 'advice' });
            });

            allPosts.sort((a, b) => b.timestamp - a.timestamp);

            setPosts(allPosts);
            setLoading(false);
            setHasMore(true);
        }
    };

    return (
        <Box>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
                rowClassName
            >
                {posts.map((post) => {
                    switch (post.type) {
                        case 'recipe':
                            return <RecipePostCard key={uuid()} recipe={post} />;
                        case 'story':
                            return <StoryPostCard key={uuid()} story={post} />;
                        case 'advice':
                            return <AdvicePostCard key={uuid()} advice={post} />;
                            default:
                                return null;
                        }
                })}
                </Masonry>
                <Flex justifyContent="center" my={4}>
                    <Button bgColor={'gray.300'} onClick={fetchPosts} isDisabled={true}>
                        Load more
                    </Button>
                </Flex>
            </Box>
        );
    };
    
    export default HomeConnectionsPostCardView;