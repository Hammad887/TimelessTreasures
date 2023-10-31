import {
    Box,
    Button,
    Center,
    Flex,
    Grid,
    GridItem,
    HStack,
    Image,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Tag,
    TagLabel,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { LockIcon } from "@chakra-ui/icons";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot } from "firebase/firestore";
import Navbar from "../../components/main/Navbar";
import ConnectionsList from "../../components/main/profile/ConnectionsList";
import ProfileEditor from "../../components/main/profile/ProfileEditor.js";
import { auth, db } from "../../firebase";

import SpecializedFeedWindow from "../../components/main/SpecializedFeedWindow.js";

import defaultPFP from "../../assets/defaultPFP.jpg";
import RecipeBook from "../../components/main/profile/RecipeBook";

import Filters from "../../components/main/recipe/RecipeFilters";
import StoryFilters from "../../components/main/story/StoryFilters";

import FlexPhoneOrNot from "../../components/main/FlexPhoneOrNot";
import StoryBook from "../../components/main/profile/StoryBook";
import Chatbot from "../../Chatbot";
import HandleLogout from "../../components/main/HandleLogout";

import ReportModal from "../../components/main/ReportModal";

import { useUser } from "../../UserContext";
import Privacy from "../../components/accessibility/Privacy";
import AddFamily from "../../components/main/profile/AddFamily";

const Profile = () => {
    const { user, setUser } = useUser();
    const { id } = useParams();

    const [currUserProfile, setCurrUserProfile] = useState({ connections: [] });

    const [profile, setProfile] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [filters, setFilters] = useState("");
    const [storyFilters, setStoryFilters] = useState("");

    const [changingConnections, setChangingConnections] = useState(false);

    const [connections, setConnections] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userProfile = await getProfile(id);
                const currUserProfile = await getProfile(currentUser.uid);
                setProfile(userProfile);
                setCurrUserProfile(currUserProfile);

                setConnections(currUserProfile.connections);
            } else {
                setUser(null);
                setProfile({});
            }
        });

        return () => {
            unsubscribe();
        };
    }, [id, changingConnections]);

    const getProfile = async (id) => {
        const profileDoc = await getDoc(doc(db, "users", id));
        return profileDoc.data();
    };

    const addConnection = async (id, idToAdd) => {
        const profileRef = doc(db, "users", id);
        const profileDoc = await getDoc(profileRef);

        if (profileDoc.exists()) {
            const connections = profileDoc.data().connections || [];

            if (!connections.includes(idToAdd)) {
                connections.push(idToAdd);
                setConnections(connections);

                await updateDoc(profileRef, { connections });
                return true;
                setChangingConnections(!changingConnections);
            }
        }

        return false;
    };

    const removeConnection = async (id, idToRemove) => {
        const profileRef = doc(db, "users", id);
        const profileDoc = await getDoc(profileRef);

        if (profileDoc.exists()) {
            const connections = profileDoc.data().connections || [];

            const updatedConnections = connections.filter(
                (connection) => connection !== idToRemove
            );

            setConnections(updatedConnections);

            await updateDoc(profileRef, { connections: updatedConnections });
            return true;
            setChangingConnections(!changingConnections);
        }

        return false;
    };

    const [privacyLevel, setPrivacyLevel] = useState("Everybody");
    const [openPrivacy, setOpenPrivacy] = useState(false);

    const [addingFamily, setAddingFamily] = useState(false);

    useEffect(() => {
        const fetchUserSettings = () => {
            if (user) {
                const unsubscribe = onSnapshot(
                    doc(db, "privacy", user.uid),
                    (userSettingsDoc) => {
                        if (userSettingsDoc.exists()) {
                            const userSettingsData = userSettingsDoc.data();
                            setPrivacyLevel(userSettingsData.privacyLevel);
                        } else {
                            setPrivacyLevel("Everybody");
                        }
                    },
                    (error) => {
                        console.error("Error fetching privacy settings:", error);
                    }
                );
                return unsubscribe;
            } else {
                setPrivacyLevel("Everybody");
            }
        };

        const unsubscribe = fetchUserSettings();
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    const handleProfileUpdate = (updatedProfile) => {
        setProfile(updatedProfile);
        onClose();
    };

    const [cancelConfirmation, setCancelConfirmation] = useState(false);

    const [originOptionsStory, setOriginOptionsStory] = useState(originOptionsSource);
    const [originOptionsRecipe, setOriginOptionsRecipe] = useState(originOptionsSource);

    const [reportModalOpen, setReportModalOpen] = useState(false);

    return (
        <Flex bg="mainBG">
            <HandleLogout cancelConfirmation={cancelConfirmation} setCancelConfirmation={setCancelConfirmation} />
            <FlexPhoneOrNot>
                <Box>
                    <Navbar />
                </Box>
                {(profile.family && !profile.family.includes(user.uid)) ?
                    <>
                        <HStack ml={-4} width={"100%"} height={"100%"} alignContent={"center"} justifyContent={"center"} cursor={"pointer"} onClick={() => setOpenPrivacy(true)} color={"profilePrivacyText"} fontSize={"lg"} fontWeight={"normal"} pl={6}>
                            <LockIcon /> 
                            <Text fontWeight={"semibold"}>This user's profile is currently private.</Text>
                        </HStack>
                    </>
                    :
                    <>
                        <Flex pb={{ base: "0vh", md: "3vh" }} width={"100%"} overflow="hidden">

                            <ReportModal data={profile} reportModalOpen={reportModalOpen} setReportModalOpen={setReportModalOpen} />

                            <AddFamily addingFamily={addingFamily} setAddingFamily={setAddingFamily} />

                            <Box width={"100%"}>
                                <VStack alignItems={"flex-start"} margin="0 auto">
                                    {user && profile ? (
                                        <>
                                            <Modal isOpen={isOpen} onClose={onClose}>
                                                <ModalOverlay />
                                                <ModalContent>
                                                    <ModalHeader fontWeight={"bold"} fontSize={"2xl"} pb={'0px'} textAlign="center">Edit Profile</ModalHeader>
                                                    <ModalCloseButton mt={3} mr={3} />
                                                    <ProfileEditor
                                                        uid={user.uid}
                                                        profile={profile}
                                                        onProfileUpdate={handleProfileUpdate}
                                                        onClose={onClose}
                                                    />
                                                </ModalContent>
                                            </Modal>

                                            <Flex textColor={"profileText"} width={"100%"} overflow="hidden">
                                                <Box flex={1} p={6} alignItems={"center"}>

                                                    {user.uid === id ?
                                                        <HStack ml={-4} width={"100%"} justifyContent={"center"} cursor={"pointer"} onClick={() => setOpenPrivacy(true)} color={"profilePrivacyText"} fontSize={"lg"} fontWeight={"normal"} pl={6}>
                                                            <Text fontWeight={"semibold"}>Who Can See My Profile:</Text>
                                                            {(privacyLevel === "Nobody") ? <Text>only me, nobody else</Text> : null}
                                                            {(privacyLevel === "Family") ? <Text>only me and my family </Text> : null}
                                                            {(privacyLevel === "Connections") ? <Text>me, family, and connections </Text> : null}
                                                            {(privacyLevel === "Everybody") ? <Text>anybody </Text> : null}
                                                        </HStack>
                                                        : null}

                                                    <Center width={"100%"}>
                                                        <HStack alignItems={"center"} p={{ base: 2, md: 6 }} pb={2} spacing={6}>
                                                            <Box minW={"100px"}>
                                                                <Image
                                                                    src={profile.pfpURL || defaultPFP}
                                                                    alt="Profile picture"
                                                                    boxSize="100px"
                                                                    objectFit="cover"
                                                                    borderRadius="full"
                                                                    boxShadow={"xl"}
                                                                />
                                                            </Box>
                                                            <VStack alignItems={"flex-start"} spacing={1}>
                                                                <Text fontWeight={"semibold"} fontSize="xl">
                                                                    {profile.name}
                                                                    <Text
                                                                        as="span"
                                                                        ml={"10px"}
                                                                        mr={"8px"}
                                                                        mb={"3.5px"}
                                                                        display="inline-block"
                                                                        h={6}
                                                                        w={"0.2rem"}
                                                                        bg="gray.200"
                                                                        verticalAlign="middle"
                                                                    />
                                                                    @{profile.username}
                                                                </Text>
                                                                <Text fontWeight={"normal"} fontSize="lg">{profile.bio}</Text>
                                                                <Box pt={"3px"}>
                                                                    {user.uid === id ? (
                                                                        <HStack spacing={2.5}>
                                                                            <Button
                                                                                onClick={onOpen}
                                                                                colorScheme="blue"
                                                                                height={"30px"}
                                                                                size="sm"
                                                                            >
                                                                                Edit Profile
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => setCancelConfirmation(true)}
                                                                                bg="gray.300"
                                                                                color={"gray.700"}
                                                                                height={"30px"}
                                                                                size="sm"
                                                                            >
                                                                                Logout
                                                                            </Button>
                                                                        </HStack>
                                                                    ) : (
                                                                        <>
                                                                            <HStack>
                                                                                {connections && connections.includes(id) ? (
                                                                                    <Button
                                                                                        onClick={() =>
                                                                                            removeConnection(
                                                                                                currUserProfile.uid,
                                                                                                id
                                                                                            )
                                                                                        }
                                                                                        colorScheme="blue"
                                                                                        height={"30px"}
                                                                                        size="sm"
                                                                                    >
                                                                                        Unconnect
                                                                                    </Button>
                                                                                ) : (
                                                                                    <Button
                                                                                        onClick={() =>
                                                                                            addConnection(currUserProfile.uid, id)
                                                                                        }
                                                                                        colorScheme="blue"
                                                                                        height={"30px"}
                                                                                        size="sm"
                                                                                    >
                                                                                        Connect
                                                                                    </Button>
                                                                                )}

                                                                                <Button
                                                                                    onClick={() =>
                                                                                        setAddingFamily(true)
                                                                                    }
                                                                                    colorScheme="purple"
                                                                                    height={"30px"}
                                                                                    size="sm"
                                                                                >
                                                                                    Add As Family
                                                                                </Button>

                                                                                <Button onClick={() => setReportModalOpen(true)} bg="gray.300" color={"red.500"} height={"30px"} size="sm">
                                                                                    Report
                                                                                </Button>
                                                                            </HStack>
                                                                        </>
                                                                    )}
                                                                </Box>
                                                            </VStack>
                                                            <Spacer />
                                                        </HStack>
                                                    </Center>
                                                </Box>
                                            </Flex>

                                            <Flex p={6} pt={0} pb={0}>
                                                <ConnectionsList uid={id} />
                                            </Flex>

                                            <Box p={{ base: 6, md: 0 }} pt={2} width="100%">
                                                <Grid
                                                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                                                    gap={6}
                                                    px={{ base: 0, md: 6 }}
                                                    pt={2}
                                                >
                                                    <GridItem>
                                                        <Box
                                                            boxShadow={"0 0 10px rgba(0, 0, 0, 0.4)"}
                                                            borderRadius={"md"}
                                                            overflow="hidden"
                                                        >
                                                            <SpecializedFeedWindow
                                                                maxh={"75vh"}
                                                                title="Recipebook"
                                                            >
                                                                <Box>
                                                                    <Flex justifyContent={"center"} flexWrap={"wrap"} display="flex" gap={"10px"} flexDirection={"row"}>
                                                                        {filters.ancestry &&
                                                                            filters.ancestry.map((filter) => (
                                                                                <Tag key={filter} fontWeight={"semibold"} height={"30px"} size="md" colorScheme="blue" borderRadius="10px">
                                                                                    <TagLabel fontSize={"lg"}>{filter}</TagLabel>
                                                                                </Tag>
                                                                            ))}
                                                                        {filters.origins &&
                                                                            filters.origins.map((filter) => (
                                                                                <Tag key={filter} height={"30px"} size="sm" p={0} m={0} size="md" bg="gray.300" borderRadius="10px" lineHeight="1">
                                                                                    <Text fontSize="33px">
                                                                                        {filter}
                                                                                    </Text>
                                                                                </Tag>
                                                                            ))}
                                                                        {filters.types &&
                                                                            filters.types.map((filter) => (
                                                                                <Tag key={filter} fontWeight={"semibold"} height={"30px"} size="md" colorScheme="purple" borderRadius="10px">
                                                                                    <TagLabel fontSize={"lg"}>{filter}</TagLabel>
                                                                                </Tag>
                                                                            ))}
                                                                        <Filters
                                                                            originOptions={originOptionsRecipe}
                                                                            setOriginOptions={setOriginOptionsRecipe}
                                                                            setFilters={setFilters}
                                                                        />
                                                                    </Flex>
                                                                </Box>
                                                                <RecipeBook uid={id} filters={filters} />
                                                            </SpecializedFeedWindow>
                                                        </Box>
                                                    </GridItem>

                                                    <GridItem>
                                                        <Box
                                                            boxShadow={"0 0 10px rgba(0, 0, 0, 0.4)"}
                                                            borderRadius={"md"}
                                                            overflow="hidden"
                                                        >
                                                            <SpecializedFeedWindow
                                                                maxh={"75vh"}
                                                                title="Storybook"
                                                            >
                                                                <Box>
                                                                    <Flex justifyContent={"center"} flexWrap={"wrap"} display="flex" gap={"10px"} flexDirection={"row"}>
                                                                        {storyFilters.ancestry &&
                                                                            storyFilters.ancestry.map((filter) => (
                                                                                <Tag key={filter} fontWeight={"semibold"} height={"30px"} size="md" colorScheme="blue" borderRadius="10px">
                                                                                    <TagLabel fontSize={"lg"}>{filter}</TagLabel>
                                                                                </Tag>
                                                                            ))}
                                                                        {storyFilters.origins &&
                                                                            storyFilters.origins.map((filter) => (
                                                                                <Tag key={filter} height={"30px"} size="sm" p={0} m={0} bg="gray.300" borderRadius="10px" lineHeight="1">
                                                                                    <Text fontSize="33px">
                                                                                        {filter}
                                                                                    </Text>
                                                                                </Tag>
                                                                            ))}
                                                                        {storyFilters.types &&
                                                                            storyFilters.types.map((filter) => (
                                                                                <Tag key={filter} fontWeight={"semibold"} height={"30px"} size="md" colorScheme="purple" borderRadius="10px">
                                                                                    <TagLabel fontSize={"lg"}>{filter}</TagLabel>
                                                                                </Tag>
                                                                            ))}
                                                                        <StoryFilters
                                                                            originOptions={originOptionsStory}
                                                                            setOriginOptions={setOriginOptionsStory}
                                                                            setFilters={setStoryFilters}
                                                                        />
                                                                    </Flex>
                                                                </Box>
                                                                <StoryBook uid={id} filters={storyFilters} />
                                                            </SpecializedFeedWindow>
                                                        </Box>
                                                    </GridItem>
                                                </Grid>
                                            </Box>
                                        </>
                                    ) : (
                                        <Text>Loading...</Text>
                                    )}
                                </VStack>
                            </Box>
                            {(user.uid === id) ? <Privacy openPrivacy={openPrivacy} setOpenPrivacy={setOpenPrivacy} /> : null}
                        </Flex>
                    </>
                }
            </FlexPhoneOrNot>

        </Flex>
    );
};

export default Profile;

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