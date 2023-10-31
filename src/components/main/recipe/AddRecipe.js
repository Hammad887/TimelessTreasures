// AddRecipe.js

import React, { useEffect, useState } from "react";

import "react-image-crop/dist/ReactCrop.css";
import { v4 as uuid } from 'uuid';

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Image,
    Input,
    InputGroup,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    SimpleGrid,
    Text,
    Textarea,
    useBreakpointValue,
} from "@chakra-ui/react";

import ImageCropper from "../ImageCropper";

import SelectTags from "./SelectRecipeTags";

import RecipeIngredients from "./RecipeIngredients.js";

import RecipeDirections from "./RecipeDirections.js";

import { MdHideImage, MdImage } from "react-icons/md";

import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { auth, db } from "../../../firebase.js";

import { useUser } from "../../../UserContext";

const AddRecipe = ({ addingCheck, setAddingCheck, onClose }) => {

    /**
     *  FUNCTIONS FOR UPLOADING
     */

    const { user, setUser } = useUser();

    const onSubmit = async () => {
        try {
            const mainIMG = mainImage ? await uploadImage(mainImage) : null;

            const newSteps = steps.map(({ id, content, image, imageURL }) => ({ id, content, image }));

            let stepsWithImages = await Promise.all(
                newSteps.map(async (step) => {
                    if (step.image) {
                        const imageURL = await uploadImage(step.image);
                        return { ...step, imageURL: imageURL };
                    }
                    return { ...step, image: null, imageURL: null };
                })
            );

            stepsWithImages = stepsWithImages.map(({ id, content, image, imageURL }) => ({ id, content, imageURL }));

            const recipeCode = uuid();

            const recipeData = {
                recipeCode: recipeCode,
                user: user.uid,
                title: title,
                description: description,
                mainImage: mainIMG,
                ingredients: ingredients,
                steps: stepsWithImages,
                ancestryTag: ancestry,
                originsTag: origins,
                typesTag: types,
                view: privacy,
                show: true,
                allowComments: true,
                allowLikes: true,
                c1: [],
                c2: [],
                timestamp: serverTimestamp(),
                story: story,
                score: 1,
                likeUsers: [user.uid],
                dislikeUsers: [],
            };

            const docRef = doc(collection(db, "recipes"), recipeCode);
            await setDoc(docRef, recipeData);

            setTitle("");
            setDescription("");
            setIngredients([{ id: 1, amount: "1", unit: "", name: "" }]);
            setSteps([{ id: 1, content: "", image: '', imageURL: '' }]);
            setAddingCheck(!addingCheck);
            onClose(recipeCode);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const uploadImage = async (imageFile) => {
        const storage = getStorage();
        const uniqueImageFile = uuid();
        const storageRef = ref(storage, `images/${user.uid}/${uniqueImageFile}`);
        await uploadBytes(storageRef, imageFile);
        const imageURL = await getDownloadURL(storageRef);
        return imageURL;
    };

    /**
     *  STATES FOR TAGS
     */

    const [ancestry, setAncestry] = useState("");
    const [origins, setOrigins] = useState([]);
    const [types, setTypes] = useState([]);
    const [originOptions, setOriginOptions] = useState(originOptionsSource);

    const [privacy, setPrivacy] = useState("public");

    /**
     *  STEPS & INGREDIENTS
     */

    const [steps, setSteps] = useState([{ id: 1, content: "", image: null, imageURL: null }]);
    const [ingredients, setIngredients] = useState([{ id: 1, amount: "1", unit: "", name: "" }]);
    const [stepImages, setStepImages] = useState({});
    const [stepImageURLs, setStepImageURLs] = useState({});

    /**
     *  MAIN IMAGE, DESCRIPTION, TITLE, STORY
     */

    const cancelRef = React.useRef()

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [story, setStory] = useState("");

    const [imageSrc, setImageSrc] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [mainImageURL, setMainImageURL] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const handleAddMainImage = (e) => {
        if (e) {
            const file = e.target.files[0];
            setImageSrc(URL.createObjectURL(e.target.files[0]));
            setShowCropper(true);
        }
    };

    const handleRemoveMainImage = () => {
        setMainImage(null);
        setMainImageURL(null);
    };

    /**
     *  ERROR PREVENTION & UI FUNCTIONS
     */

    const [cancelConfirmation, setCancelConfirmation] = useState(false);
    const [alertErrors, setAlertErrors] = useState([]);

    const [screen, setScreen] = useState(1);

    const checkFieldValues = () => {
        let empties = [];
        if (title.trim() === "") {
            empties.push("title");
        }
        if (description.trim() === "") {
            empties.push("description");
        }
        if (ingredients.length === 1 && ingredients[0].name.trim() === "") {
            empties.push("ingredients");
        }
        if (steps.length === 1 && steps[0].content.trim() === "") {
            empties.push("directions");
        }
        // if (story.trim() === "") {
        //     empties.push("story");
        // }
        return empties;
    }

    const checkNext = () => {
        let empties = checkFieldValues();
        setAlertErrors(empties);
        if (empties.length === 0) {
            setScreen(2);
        }
    };

    const confirmCancel = () => {
        let empties = checkFieldValues();
        if (empties.length === 5) {
            onClose();
        } else {
            setCancelConfirmation(true);
        }
    };

    const handleAlertClose = () => {
        setCancelConfirmation(false);
    };

    const columns = useBreakpointValue({ base: 1, md: 1 });

    return (
        <ModalContent maxW={{ base: "95%", lg: "80%" }}>

            <AlertDialog
                closeOnOverlayClick={false}
                isOpen={cancelConfirmation}
                leastDestructiveRef={cancelRef}
                initialFocusRef={cancelRef}
                onClose={handleAlertClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent top={"22%"}>
                        <AlertDialogHeader fontWeight={"bold"} fontSize={"xl"} pb={"0px"}>You have progress on this recipe</AlertDialogHeader>
                        <AlertDialogBody fontWeight={"boldish"} fontSize={"lg"} pb={"0px"} >Are you sure you want to stop making the recipe? Changes will not be saved unless you post.</AlertDialogBody>
                        <AlertDialogFooter mt={2} mb={2} width={"100%"} justifyContent={"center"}>
                            <Button width={"100%"} fontSize={"xl"} colorScheme="red" mr={3} onClick={onClose}>Yes</Button>
                            <Button width={"100%"} fontSize={"xl"} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }} autoFocus ref={cancelRef} onClick={() => setCancelConfirmation(false)}>No</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {(screen === 1) ?

                <Box>

                    <ModalHeader fontWeight={"bold"} fontSize={"2xl"} pb={'0px'} textAlign="center">Add a Recipe</ModalHeader>

                    <ModalBody>
                        <ImageCropper
                            isOpen={showCropper}
                            onClose={() => setShowCropper(false)}
                            onImageCropped={(croppedImageBlob) => {
                                const croppedImageFile = new File([croppedImageBlob], 'cropped_image.jpeg', { type: 'image/jpeg' });
                                setMainImage(croppedImageFile);
                                setMainImageURL(URL.createObjectURL(croppedImageFile));
                            }}
                            src={imageSrc}
                        />

                        <FormControl id="title">

                            {(alertErrors.includes("title")) ?
                                <FormLabel fontSize="xl" mb={1} fontWeight="semibold" color={"red"}>Title (please fill out)</FormLabel>
                                :
                                <FormLabel fontSize="xl" mb={1} fontWeight="semibold">Title</FormLabel>
                            }

                            <Input
                                value={title}
                                size={"lg"}
                                fontWeight={"normal"}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter the recipe title"
                            />

                        </FormControl>

                        <Flex mt={4} width="100%" direction="row" justifyContent="space-between" alignItems="center">
                            <FormControl id="description">

                                {(alertErrors.includes("description")) ?
                                    <FormLabel fontSize="xl" mb={1} fontWeight="semibold" color={"red"}>Description (please fill out)</FormLabel>
                                    :
                                    <FormLabel fontSize="xl" mb={1} fontWeight="semibold">Description</FormLabel>
                                }

                            </FormControl>
                            <Box>
                                <InputGroup pb={'7px'} alignItems="flex-end">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        id="hola_there_code_viewer"
                                        onChange={(e) => { handleAddMainImage(e) }}
                                    />

                                    {mainImageURL ? (
                                        <IconButton
                                            aria-label="Remove selected main image"
                                            pl="8px"
                                            pr="8px"
                                            icon={<HStack><MdHideImage /><Text>Remove Image</Text></HStack>}
                                            onClick={() => handleRemoveMainImage()}
                                            size="sm"
                                        />
                                    ) : (
                                        <IconButton
                                            aria-label="Add main image"
                                            pl="8px"
                                            pr="8px"
                                            icon={<HStack><MdImage /><Text>Add A Main Image</Text></HStack>}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(`hola_there_code_viewer`).click();
                                            }}
                                            size={"sm"}
                                        />
                                    )}
                                </InputGroup>
                            </Box>

                        </Flex>

                        <HStack flex={1} alignItems="center">
                            {(mainImageURL) ?
                                <HStack pt="10px" height={"100%"} width="100%">

                                    <Textarea
                                        value={description}
                                        fontWeight={"normal"}
                                        resize="vertical"
                                        h={"8em"}
                                        size={"lg"}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter the recipe description"
                                    />

                                    <Image flex={1} key={mainImageURL} src={mainImageURL} maxH={"14em"} width="40%" objectFit="contain" borderRadius="md" />
                                
                                </HStack>
                                :
                                <Textarea
                                    size={"lg"}
                                    resize="vertical"
                                    fontWeight={"normal"}
                                    width={"100%"}
                                    minHeight={"5em"}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter the recipe description"
                                />
                            }
                        </HStack>

                        <FormControl mt={4} id="title">
                            <FormLabel fontSize="xl" mb={1} fontWeight="semibold">Story (optional)</FormLabel>

                            <Textarea
                                size={"lg"}
                                resize="vertical"
                                fontWeight={"normal"}
                                width={"100%"}
                                minHeight={"5em"}
                                value={story}
                                onChange={(e) => setStory(e.target.value)}
                                placeholder="Share the history behind this recipe"
                            />

                        </FormControl>

                        <SimpleGrid
                            columns={{ base: 1, lg: 2 }}
                            mt={4}
                            spacing={4}
                            spacingX={{ base: 4, lg: 8 }}
                        >

                            <RecipeIngredients alertErrors={alertErrors} ingredients={ingredients} setIngredients={setIngredients} />

                            <RecipeDirections alertErrors={alertErrors} steps={steps} setSteps={setSteps} />

                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter mb={2} width={"100%"} justifyContent={"center"}>
                        <Button fontSize={"xl"}  width={"100%"} colorScheme="blue" mr={2} onClick={checkNext}>
                            Next
                        </Button>
                        <Button fontSize={"xl"}  width={"100%"} ml={2} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }}  onClick={() => confirmCancel()}>Cancel</Button>
                    </ModalFooter>

                </Box>
                :
                <SelectTags originOptions={originOptions} setOriginOptions={setOriginOptions} goBack={() => setScreen(1)} onClose={confirmCancel} onSubmit={onSubmit} ancestry={ancestry} setAncestry={setAncestry} origins={origins} setOrigins={setOrigins} types={types} setTypes={setTypes} privacy={privacy} setPrivacy={setPrivacy} />
            }
        </ModalContent>
    );
}

export default AddRecipe;

const originOptionsSource = {
    '🇦🇨': '  Ascension Island', '🇦🇩': '  Andorra', '🇦🇪': '  United Arab Emirates', '🇦🇫': '  Afghanistan', '🇦🇬': '  Antigua & Barbuda', '🇦🇮': '  Anguilla', '🇦🇱': '  Albania', '🇦🇲': '  Armenia',
    '🇦🇴': '  Angola', '🇦🇶': '  Antarctica', '🇦🇷': '  Argentina', '🇦🇸': '  American Samoa', '🇦🇹': '  Austria', '🇦🇺': '  Australia', '🇦🇼': '  Aruba', '🇦🇽': '  Åland Islands', '🇦🇿': '  Azerbaijan', '🇧🇦': '  Bosnia & Herzegovina',
    '🇧🇧': '  Barbados', '🇧🇩': '  Bangladesh', '🇧🇪': '  Belgium', '🇧🇫': '  Burkina Faso', '🇧🇬': '  Bulgaria', '🇧🇭': '  Bahrain', '🇧🇮': '  Burundi', '🇧🇯': '  Benin', '🇧🇱': '  St. Barthélemy', '🇧🇲': '  Bermuda',
    '🇧🇳': '  Brunei', '🇧🇴': '  Bolivia', '🇧🇶': '  Caribbean Netherlands', '🇧🇷': '  Brazil', '🇧🇸': '  Bahamas', '🇧🇹': '  Bhutan', '🇧🇻': '  Bouvet Island', '🇧🇼': '  Botswana', '🇧🇾': '  Belarus', '🇧🇿': '  Belize',
    '🇨🇦': '  Canada', '🇨🇨': '  Cocos (Keeling) Islands', '🇨🇩': '  Congo - Kinshasa', '🇨🇫': '  Central African Republic', '🇨🇬': '  Congo - Brazzaville', '🇨🇭': '  Switzerland', '🇨🇮': '  Côte d’Ivoire',
    '🇨🇰': '  Cook Islands', '🇨🇱': '  Chile', '🇨🇲': '  Cameroon', '🇨🇳': '  China', '🇨🇴': '  Colombia', '🇨🇵': '  Clipperton Island', '🇨🇷': '  Costa Rica', '🇨🇺': '  Cuba', '🇨🇻': '  Cape Verde', '🇨🇼': '  Curaçao',
    '🇨🇽': '  Christmas Island', '🇨🇾': '  Cyprus', '🇨🇿': '  Czechia', '🇩🇪': '  Germany', '🇩🇬': '  Diego Garcia', '🇩🇯': '  Djibouti', '🇩🇰': '  Denmark', '🇩🇲': '  Dominica', '🇩🇴': '  Dominican Republic',
    '🇩🇿': '  Algeria', '🇪🇦': '  Ceuta & Melilla', '🇪🇨': '  Ecuador', '🇪🇪': '  Estonia', '🇪🇬': '  Egypt', '🇪🇭': '  Western Sahara', '🇪🇷': '  Eritrea', '🇪🇸': '  Spain', '🇪🇹': '  Ethiopia', '🇪🇺': '  European Union',
    '🇫🇮': '  Finland', '🇫🇯': '  Fiji', '🇫🇰': '  Falkland Islands', '🇫🇲': '  Micronesia', '🇫🇴': '  Faroe Islands', '🇫🇷': '  France', '🇬🇦': '  Gabon', '🇬🇧': '  United Kingdom',
    '🇬🇩': '  Grenada', '🇬🇪': '  Georgia', '🇬🇫': '  French Guiana', '🇬🇬': '  Guernsey', '🇬🇭': '  Ghana', '🇬🇮': '  Gibraltar', '🇬🇱': '  Greenland', '🇬🇲': '  Gambia', '🇬🇳': '  Guinea', '🇬🇵': '  Guadeloupe',
    '🇬🇶': '  Equatorial Guinea', '🇬🇷': '  Greece', '🇬🇸': '  South Georgia & South Sandwich Islands', '🇬🇹': '  Guatemala', '🇬🇺': '  Guam', '🇬🇼': '  Guinea-Bissau', '🇬🇾': '  Guyana', '🇭🇰': '  Hong Kong SAR China',
    '🇭🇲': '  Heard & McDonald Islands', '🇭🇳': '  Honduras', '🇭🇷': '  Croatia', '🇭🇹': '  Haiti', '🇭🇺': '  Hungary', '🇮🇨': '  Canary Islands', '🇮🇩': '  Indonesia', '🇮🇪': '  Ireland', '🇮🇱': '  Israel',
    '🇮🇲': '  Isle of Man', '🇮🇳': '  India', '🇮🇴': '  British Indian Ocean Territory', '🇮🇶': '  Iraq', '🇮🇷': '  Iran', '🇮🇸': '  Iceland', '🇮🇹': '  Italy', '🇯🇪': '  Jersey', '🇯🇲': '  Jamaica', '🇯🇴': '  Jordan',
    '🇯🇵': '  Japan', '🇰🇪': '  Kenya', '🇰🇬': '  Kyrgyzstan', '🇰🇭': '  Cambodia', '🇰🇮': '  Kiribati', '🇰🇲': '  Comoros', '🇰🇳': '  St. Kitts & Nevis', '🇰🇵': '  North Korea', '🇰🇷': '  South Korea', '🇰🇼': '  Kuwait',
    '🇰🇾': '  Cayman Islands', '🇰🇿': '  Kazakhstan', '🇱🇦': '  Laos', '🇱🇧': '  Lebanon', '🇱🇨': '  St. Lucia', '🇱🇮': '  Liechtenstein', '🇱🇰': '  Sri Lanka', '🇱🇷': '  Liberia', '🇱🇸': '  Lesotho', '🇱🇹': '  Lithuania',
    '🇱🇺': '  Luxembourg', '🇱🇻': '  Latvia', '🇱🇾': '  Libya', '🇲🇦': '  Morocco', '🇲🇨': '  Monaco', '🇲🇩': '  Moldova', '🇲🇪': '  Montenegro', '🇲🇫': '  St. Martin', '🇲🇬': '  Madagascar', '🇲🇭': '  Marshall Islands',
    '🇲🇰': '  North Macedonia', '🇲🇱': '  Mali', '🇲🇲': '  Myanmar (Burma)', '🇲🇳': '  Mongolia', '🇲🇴': '  Macao Sar China', '🇲🇵': '  Northern Mariana Islands', '🇲🇶': '  Martinique', '🇲🇷': '  Mauritania',
    '🇲🇸': '  Montserrat', '🇲🇹': '  Malta', '🇲🇺': '  Mauritius', '🇲🇻': '  Maldives', '🇲🇼': '  Malawi', '🇲🇽': '  Mexico', '🇲🇾': '  Malaysia', '🇲🇿': '  Mozambique', '🇳🇦': '  Namibia', '🇳🇨': '  New Caledonia',
    '🇳🇪': '  Niger', '🇳🇫': '  Norfolk Island', '🇳🇬': '  Nigeria', '🇳🇮': '  Nicaragua', '🇳🇱': '  Netherlands', '🇳🇴': '  Norway', '🇳🇵': '  Nepal', '🇳🇷': '  Nauru', '🇳🇺': '  Niue', '🇳🇿': '  New Zealand', '🇴🇲': '  Oman',
    '🇵🇦': '  Panama', '🇵🇪': '  Peru', '🇵🇫': '  French Polynesia', '🇵🇬': '  Papua New Guinea', '🇵🇭': '  Philippines', '🇵🇰': '  Pakistan', '🇵🇱': '  Poland', '🇵🇲': '  St. Pierre & Miquelon', '🇵🇳': '  Pitcairn Islands',
    '🇵🇷': '  Puerto Rico', '🇵🇸': '  Palestinian Territories', '🇵🇹': '  Portugal', '🇵🇼': '  Palau', '🇵🇾': '  Paraguay', '🇶🇦': '  Qatar', '🇷🇪': '  Réunion', '🇷🇴': '  Romania', '🇷🇸': '  Serbia', '🇷🇺': '  Russia',
    '🇷🇼': '  Rwanda', '🇸🇦': '  Saudi Arabia', '🇸🇧': '  Solomon Islands', '🇸🇨': '  Seychelles', '🇸🇩': '  Sudan', '🇸🇪': '  Sweden', '🇸🇬': '  Singapore', '🇸🇭': '  St. Helena', '🇸🇮': '  Slovenia',
    '🇸🇯': '  Svalbard & Jan Mayen', '🇸🇰': '  Slovakia', '🇸🇱': '  Sierra Leone', '🇸🇲': '  San Marino', '🇸🇳': '  Senegal', '🇸🇴': '  Somalia', '🇸🇷': '  Suriname', '🇸🇸': '  South Sudan', '🇸🇹': '  São Tomé & Príncipe',
    '🇸🇻': '  El Salvador', '🇸🇽': '  Sint Maarten', '🇸🇾': '  Syria', '🇸🇿': '  Eswatini', '🇹🇦': '  Tristan Da Cunha', '🇹🇨': '  Turks & Caicos Islands', '🇹🇩': '  Chad', '🇹🇫': '  French Southern Territories', '🇹🇬': '  Togo',
    '🇹🇭': '  Thailand', '🇹🇯': '  Tajikistan', '🇹🇰': '  Tokelau', '🇹🇱': '  Timor-Leste', '🇹🇲': '  Turkmenistan', '🇹🇳': '  Tunisia', '🇹🇴': '  Tonga', '🇹🇷': '  Turkey', '🇹🇹': '  Trinidad & Tobago', '🇹🇻': '  Tuvalu',
    '🇹🇼': '  Taiwan', '🇹🇿': '  Tanzania', '🇺🇦': '  Ukraine', '🇺🇬': '  Uganda', '🇺🇲': '  U.S. Outlying Islands', '🇺🇳': '  United Nations', '🇺🇸': '  United States', '🇺🇾': '  Uruguay', '🇺🇿': '  Uzbekistan',
    '🇻🇦': '  Vatican City', '🇻🇨': '  St. Vincent & Grenadines', '🇻🇪': '  Venezuela', '🇻🇬': '  British Virgin Islands', '🇻🇮': '  U.S. Virgin Islands', '🇻🇳': '  Vietnam', '🇻🇺': '  Vanuatu', '🇼🇫': '  Wallis & Futuna',
    '🇼🇸': '  Samoa', '🇽🇰': '  Kosovo', '🇾🇪': '  Yemen', '🇾🇹': '  Mayotte', '🇿🇦': '  South Africa', '🇿🇲': '  Zambia', '🇿🇼': '  Zimbabwe', '🏴󠁧󠁢󠁥󠁮󠁧󠁿': '  England', '🏴󠁧󠁢󠁳󠁣󠁴󠁿': '  Scotland', '🏴󠁧󠁢󠁷󠁬󠁳󠁿': '  Wales'
};