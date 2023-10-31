import React from 'react';
import { Box, useMediaQuery, Text } from '@chakra-ui/react';

const Testimonials = () => {
    const [isLargerThanLG] = useMediaQuery('(min-width: 62em)');

    return (
        <Box
            id="testimonials"
            maxWidth={isLargerThanLG ? '1400px' : 'full'}
            minHeight="70vh"
            justifyContent="center"
            alignItems="center"
            py="16"
            px={isLargerThanLG ? '16' : '6'}
            mx="auto"
            display="flex"
            flexDirection="column"
        >
            <Text
                fontSize={isLargerThanLG ? '40px' : '36px'}
                fontWeight="bold"
                mt={"6"}
                mb="6"
            >
                Introduction Video
            </Text>
            <iframe
                width={isLargerThanLG ? '800px' : '100%'}
                height="450"
                src="https://www.youtube.com/embed/qG-d7VOkXz8"
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            ></iframe>
        </Box>
    );
};

export default Testimonials;