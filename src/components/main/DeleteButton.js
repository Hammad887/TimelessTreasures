// DeleteButton.js

import React, { useState } from "react";

import {
    Flex,
    HStack,
    IconButton,
    Text
} from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";

const DeleteButton = ( {aria, removeStep, id} ) => {

    const [deleting, setDeleting] = useState(false);

    return (
        <Flex>
            {(deleting) ?
            <HStack>
                <IconButton
                    aria-label={`Press to confirm deletion of ${aria}`}
                    pl="8px"
                    pr="8px"
                    _hover={{ backgroundColor: "red.400" }}
                    bgColor={'red.200'}
                    icon={<HStack><DeleteIcon mr={'-4px'} mb={'1px'} /><Text>?</Text></HStack>}
                    onClick={() => { removeStep(id); setDeleting(false); }}
                    size="sm"
                />        
                <IconButton
                    aria-label={`Nevermind, don't delete this ${aria}`}
                    pl="8px"
                    pr="8px"
                    _hover={{ backgroundColor: "green.200" }}
                    bgColor={'green.100'}
                    icon={<HStack><Text>Keep</Text></HStack>}
                    onClick={() => setDeleting(false)}
                    size="sm"
                />    
            </HStack>
            :
            <IconButton
                aria-label={`Delete this ${aria}`}
                icon={<DeleteIcon />}
                onClick={() => setDeleting(true)}
                size="sm"
            />
            }
        </Flex>         
    );
}

export default DeleteButton;