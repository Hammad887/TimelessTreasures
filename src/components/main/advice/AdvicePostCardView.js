import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Flex,
    Grid
} from '@chakra-ui/react';

import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';

import { db } from "../../../firebase.js";

import PostCard from './AdvicePostCard.js';

import Masonry from 'react-masonry-css';
import '../../../styles/PostCardView.css';

import { v4 as uuid } from 'uuid';

const AdvicePostCardView = ({ addingCheck, filters }) => {
    const [advice, setAdvice] = useState([]);
    const [filteredAdvice, setFilteredAdvice] = useState([]);

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

    const fetchAdvice = async (lastVisibleDoc) => {
        if (!loading) {
            setLoading(true);
            const adviceRef = collection(db, 'advice');

            let q;

            if (lastVisibleDoc) {
                q = query(adviceRef, orderBy('timestamp', 'desc'), startAfter(lastVisibleDoc), limit(paginationSize));
            } else {
                q = query(adviceRef, orderBy('timestamp', 'desc'), limit(paginationSize));
            }

            const querySnapshot = await getDocs(q);

            const docs = [];

            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });

            setAdvice(docs);

            // setAdvice((prevAdvice) => [...prevAdvice, ...docs]);
            // setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setLoading(false);

            if (querySnapshot.docs.length < paginationSize) {
                setHasMore(false);
            }
        }
    };

    useEffect(() => {
        fetchAdvice(null);
    }, [addingCheck]);

    const loadMore = () => {
        if (!loading) {
            fetchAdvice(null);
        }
    };

    useEffect(() => {
        console.log(filters);
        if (advice && filters && (filters.origins.length > 0 || filters.types.length > 0)) {
            const filtering = advice.filter((advice) => {

                if (filters.types && filters.types.length > 0 && !filters.types.some((type) => advice.typesTag.includes(type))) {
                    return false;
                }

                if (filters.origins && filters.origins.length > 0 && !filters.origins.some((origin) => advice.originsTag.includes(origin))) {
                    return false;
                }

                return true;
            });

            setFilteredAdvice(filtering);
        } else {
            setFilteredAdvice(advice);
        }

    }, [filters, advice]);

    return (
        <Box>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
                rowClassName
            >
                {filteredAdvice.map((advice) => (
                    <PostCard key={uuid()} advice={advice} />
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

export default AdvicePostCardView;
