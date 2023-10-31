import React, { useState } from "react";

import { MdHideImage, MdImage } from "react-icons/md";

import {
    HStack,
    IconButton,
    Input,
    InputGroup,
    Text
} from "@chakra-ui/react";

const ImageInput = ({ stepID, image, onImageChange, onImageRemove }) => {
    const [previewImage, setPreviewImage] = useState(false);

    const handleImageChange = (e) => {
        if (e) {
            onImageChange(e.target.files[0], URL.createObjectURL(e.target.files[0]));
            setPreviewImage(true);
        }
    };

    const handleImageRemove = () => {
        onImageRemove();
        setPreviewImage(false);
    };

    return (
        <InputGroup>
            <Input
                type="file"
                accept="image/*"
                hidden
                id={`imageInput-${stepID}`}
                onChange={handleImageChange}
            />

            {previewImage ? (
                <HStack>
                    <IconButton
                        aria-label="Remove image"
                        pl="8px"
                        pr="8px"
                        height={"30px"}
                        icon={<HStack><MdHideImage /><Text>Remove Image</Text></HStack>}
                        onClick={handleImageRemove}
                        size="xs"
                    />
                </HStack>
            ) : (
                <IconButton
                    aria-label="Add an image to a step"
                    pl="8px"
                    pr="8px"
                    height={"30px"}
                    icon={<HStack><MdImage /><Text>Add Image</Text></HStack>}
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(`imageInput-${stepID}`).click();
                    }}
                    size={"xs"}
                />
            )}
        </InputGroup>
    );
};

export default ImageInput;