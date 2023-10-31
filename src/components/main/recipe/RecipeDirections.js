// RecipeDirections.js

import React, { useState } from "react";

import {
    Box,
    Flex,
    FormLabel,
    HStack,
    IconButton,
    Image,
    Input,
    InputGroup,
    Text,
    Textarea,
    VStack,
    useBreakpointValue
} from "@chakra-ui/react";

import ImageCropper from "../ImageCropper.js";

import DeleteButton from "../DeleteButton.js";


import { MdHideImage, MdImage } from "react-icons/md";


import { AddIcon } from "@chakra-ui/icons";

const RecipeDirections = ( { alertErrors, steps, setSteps } ) => {

    const columns = useBreakpointValue({ base: 1, md: 1 });

    const [showCropper, setShowCropper] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [currCropIMGID, setCurrCropIMGID] = useState(1);

    const [stepImages, setStepImages] = useState({});
    const [stepImageURLs, setStepImageURLs] = useState({});

    const addStep = () => {
        setSteps((prevSteps) => [
        ...prevSteps,
        {
            id: prevSteps[prevSteps.length - 1].id + 1,
            content: "",
            image: null,
            imageURL: null,
        },
        ]);
    };
    
    const removeStep = (id) => {
        setSteps((prevSteps) => {
        const newSteps = prevSteps.filter((step) => step.id !== id);
        return newSteps.map((step, index) => ({ ...step, id: index + 1 }));
        });
    };
    
    const updateStep = (id, content, image, imageURL) => {
        let updateImage = image;
        let updateImageURL = imageURL;
        
        setSteps((prevSteps) =>
            prevSteps.map((step) =>
                step.id === id ? { id, content, image, imageURL } : step
            )
        );
    };
    
    const insertStep = (index) => {
        setSteps((prevSteps) => {
        const newSteps = [
            ...prevSteps.slice(0, index + 1),
            {
            id: prevSteps[index].id + 1,
            content: "",
            image: null,
            imageURL: null,
            },
            ...prevSteps.slice(index + 1),
        ];
        return newSteps.map((step, idx) => ({ ...step, id: idx + 1 }));
        });
    };

    const handleImageChange = (e, selfID) => {
        if (e) {
            setImageSrc(URL.createObjectURL(e.target.files[0]));
            setCurrCropIMGID(selfID);
            setShowCropper(true);
        }
    };

    const changeImage = (file, fileURL) => {
        setSteps((prevSteps) => {
            return prevSteps.map((step) => {
            if (step.id === currCropIMGID) {
                return {
                ...step,
                image: file,
                imageURL: fileURL,
                };
            } else {
                return step;
            }
            });
        });
    };
    
    const handleImageRemove = (selfID) => {
        setSteps((prevSteps) => {
        return prevSteps.map((step) => {
            if (step.id === selfID) {
            return {
                ...step,
                image: null,
                imageURL: null,
            };
            } else {
            return step;
            }
        });
        });
    };

    return (
        <VStack spacing={2}>

            <ImageCropper
                isOpen={showCropper}
                onClose={() => setShowCropper(false)}
                onImageCropped={(croppedImageBlob) => {
                    const croppedImageFile = new File([croppedImageBlob], 'cropped_image.jpeg', { type: 'image/jpeg' });
                    changeImage(croppedImageFile, URL.createObjectURL(croppedImageFile));
                }}
                src={imageSrc}
            />

            { (alertErrors.includes("directions") ) ?
                <FormLabel fontSize="xl" mb={1} fontWeight="semibold" color={"red"}>Directions (please fill out at least one)</FormLabel>
            :
                <FormLabel fontSize="xl" mb={1} fontWeight="semibold">Directions</FormLabel>
            }   

            {steps.map((step, index) => (
                <Box key={step.id} width="100%">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontWeight={"semibold"} fontSize="lg">{`Step ${step.id}`}</Text>
                        <VStack spacing={1}>
                            <HStack>
                                <InputGroup>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        id={`imageInput-${step.id}`}
                                        onChange={(e) => {handleImageChange(e, step.id)}}
                                    />

                                    {step.imageURL ? (
                                        <HStack>
                                            <IconButton
                                                aria-label="Remove image"
                                                pl="8px"
                                                pr="8px"
                                                icon={<HStack><MdHideImage /><Text>Remove Image</Text></HStack>}
                                                onClick={() => handleImageRemove(step.id)} 
                                                size="sm"
                                            />
                                        </HStack>
                                    ) : (
                                        <IconButton
                                            aria-label="Add an image to a step"
                                            pl="8px"
                                            pr="8px"
                                            icon={<HStack><MdImage /><Text>Add Image</Text></HStack>}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(`imageInput-${step.id}`).click();
                                            }}
                                            size={"sm"}
                                        />
                                    )}
                                </InputGroup>

                                {steps.length > 1 && (
                                    <DeleteButton aria={"step"} removeStep={removeStep} id={step.id} />
                                )}

                                <IconButton
                                    aria-label="Add step"

                                    icon={<AddIcon />}
                                    onClick={() => insertStep(index)}
                                    size={"sm"}
                                />
                    
                            </HStack>
                        </VStack>
                    </Flex>
                    <HStack flex={1} alignItems="center">
                        {(step.imageURL) ? 
                            <HStack pt="10px" width="100%">
                                <Textarea
                                    size={"lg"}
                                    fontWeight={"normal"}
                                    resize="vertical"
                                    h="8em"
                                    size="lg"
                                    value={step.content}
                                    onChange={(e) => updateStep(step.id, e.target.value, step.image, step.imageURL)}
                                    placeholder={`example: mix everything together`}
                                />
                                <Image flex={1} key={step.imageURL} src={step.imageURL} maxH={"14em"} objectFit="contain" borderRadius="md" />
                            </HStack>
                            : 
                            <Textarea
                                mt={2}
                                fontWeight={"normal"}
                                size={"lg"}
                                width={"100%"}
                                value={step.content}
                                onChange={(e) => updateStep(step.id, e.target.value, null, null)}
                                placeholder={`example: mix everything together`}
                                resize="vertical"
                            />
                        }
                    </HStack>
                </Box>
            ))}
        </VStack>
    );
}

export default RecipeDirections;