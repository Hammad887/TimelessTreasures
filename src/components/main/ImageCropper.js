import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropper = ({ isOpen, onClose, onImageCropped, src }) => {

    const [croppedImage, setCroppedImage] = useState(null);

    const [crop, setCrop] = useState({
        unit: "%",
        width: 50,
        height: 50,
        minWidth: 0,
        minHeight: 0,
        maxWidth: 100,
        maxHeight: 100,
    });

    const [imageRef, setImageRef] = useState(null);

    // const handleCropChange = (newCrop, percentCrop) => {
    //     if (newCrop.height <= newCrop.width * 1.1 && newCrop.height >= newCrop.width * 0.6) {
    //       setCrop(newCrop);
    //     }

    // };

    const onCropComplete = async () => {
        if (imageRef && crop.width && crop.height) {
            const cropped = await getCroppedImg(imageRef, crop);
            setCroppedImage(cropped);
            if (onImageCropped) {
                onImageCropped(cropped);
            }
            onClose();
        }
    };

    const getCroppedImg = (image, crop) => {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/jpeg");
        });
    };
    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontWeight={"bold"} fontSize={"2xl"} pb={"0px"} textAlign="center">Crop Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    {/* <Image width="100%" height="100%" src={src} /> */}

                    {src && (
                        <Flex>
                            <ReactCrop
                                src={src}
                                crop={crop}
                                onImageLoaded={setImageRef}
                                onChange={setCrop}
                            // onChange={handleCropChange}
                            />
                        </Flex>

                    )}
                </ModalBody>
                <ModalFooter mt={2} mb={2} width={"100%"} justifyContent={"center"}>
                    <Button fontSize={"xl"} width={"100%"} colorScheme="blue" mr={2} onClick={onCropComplete}>
                        Done
                    </Button>
                    <Button fontSize={"xl"} width={"100%"} ml={2} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }} onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ImageCropper;