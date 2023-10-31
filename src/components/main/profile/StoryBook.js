import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Flex,
    Grid
} from '@chakra-ui/react';

import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';

import { db } from "../../../firebase.js";

import PostCard from '../story/StoryPostCard.js';

import Masonry from 'react-masonry-css';
import '../../../styles/PostCardView.css';

import { v4 as uuid } from 'uuid';

const StoryBook = ({ uid, filters }) => {
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);

    const [lastDoc, setLastDoc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const paginationSize = 200;

    const breakpointColumnsObj = {
        default: 2,
        1400: 1,
        900: 1,
        500: 1,
    };

    const fetchStories = async (lastVisibleDoc) => {
        if (!loading) {
            setLoading(true);
            const storiesRef = collection(db, 'stories');

            let q;

            if (lastVisibleDoc) {
                q = query(
                    storiesRef,
                    where('user', '==', uid),
                    orderBy('timestamp', 'desc'),
                    startAfter(lastVisibleDoc),
                    limit(paginationSize)
                );
            } else {
                q = query(
                    storiesRef,
                    where('user', '==', uid),
                    orderBy('timestamp', 'desc'),
                    limit(paginationSize)
                );
            }

            const querySnapshot = await getDocs(q);

            const docs = [];

            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });

            setStories((prevStories) => [...prevStories, ...docs]);
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setLoading(false);

            if (querySnapshot.docs.length < paginationSize) {
                setHasMore(false);
            }
        }
    };

    useEffect(() => {
        setStories([]);
        fetchStories(null);
    }, [uid]);

    const loadMore = () => {
        if (!loading) {
            fetchStories(null);
        }
    };

    useEffect(() => {
        console.log(filters);
        if (stories && filters && (filters.origins.length > 0 || filters.ancestry != '' || filters.types.length > 0)) {
            const filtering = stories.filter((story) => {
                
                if (filters.types && filters.types.length > 0 && !filters.types.some((type) => story.typesTag.includes(type))) {
                    return false;
                }
                
                if (filters.origins && filters.origins.length > 0 && !filters.origins.some((origin) => story.originsTag.includes(origin))) {
                    return false;
                }

                if (filters.ancestry && filters.ancestry.length > 0 && !story.ancestryTag.some((ancestry) => (ancestry == filters.ancestry))) {
                    return false;
                }

                return true;
            });

            setFilteredStories(filtering);
        } else {
            setFilteredStories(stories);
        }

    }, [filters, stories]);

    return (
        <Box>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
                rowClassName
            >
                {filteredStories.map((story) => (
                    <PostCard isBook={true} key={uuid()} story={story} />
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

export default StoryBook;