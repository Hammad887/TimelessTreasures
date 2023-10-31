// Timeless Treasures by Team Elderly Frogs @ UC Berkeley
// Team Members: Bhada Yun, Emily Lee, Hammad Afzal
// This is the FeedWindow.js file, which is an individual content/feed display that you can collapse or uncollapse.

import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Collapse, Flex, Heading, IconButton, VStack } from "@chakra-ui/react";
import React, { useState } from "react";

// This is the FeedWindow component that specifies the content on the first page. It takes in title and maxh as props.
// For refernence, the "children" prop just refers to any data nested within the tags of the component. So if you have a <p>Hi</p> within FeedWindow, that is passed through "children"
const SpecializedFeedWindow = ({ title, children, maxh }) => {

    // State of collapse default set to false so all the content shows at the beginning. Can change this by calling setIsCollapse(false or true)
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Function that changes the collapse state. If true => false. If false => true
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        // The entire "content" for this feedwindow is in this box.
        <Flex
            bg="gray.200"
            borderRadius="md"
            overflow="hidden"
            flexGrow={1}
            flexDirection={"column"}
            minWidth={'100%'}
        >
            <Flex
                bg="feedWindowHeader"
                p={1.5} // p is padding
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                onClick={toggleCollapse}
                cursor="pointer"
                flexGrow={1}
            >
                {/* Renders the "title" or header of the data with appropriate styling */}
                <Heading ml={'35px'} as="h3" fontSize="2xl" color="feedWindowHeaderText" textAlign="center" flex="1">
                    { title }
                </Heading>
                <IconButton
                    aria-label="Toggle collapse"
                    icon={
                        // This changes whether the arrow is pointing up or down (collapse or not)
                        isCollapsed ? (
                            <ChevronDownIcon color="white" w={5} h={5} />
                            ) : (
                            <ChevronUpIcon color="white" w={5} h={5} />
                        )
                    }
                    onClick={toggleCollapse}
                    size="sm"
                    variant="unstyled"
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                />
            </Flex>
            {/* Collapsable content. If isCollapsed is false, show content! */}
            <Collapse in={!isCollapsed}>
                <VStack
                    p={4}
                    spacing={4}
                    overflowY="scroll"
                    width={"100%"}
                    maxHeight={maxh} // Set the maxHeight property
                    css={{
                        "&::-webkit-scrollbar": { // Change scrollbar styling
                        width: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": { // For iPad
                        bg: "gray.600",
                        borderRadius: "99px",
                        },
                    }}
                >
                    { children }
                </VStack>
            </Collapse>
        </Flex>
    );
};

export default SpecializedFeedWindow;