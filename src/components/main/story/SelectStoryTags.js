// SelectTags.js

import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    Select
} from "@chakra-ui/react";
import React, { useState } from "react";

const SelectStoryTags = ({ originOptions, setOriginOptions, goBack, onClose, onSubmit, ancestry, setAncestry, origins, setOrigins, types, setTypes, privacy, setPrivacy }) => {

    const [filter, setFilter] = useState("");

    const ancestryOptions = [
        "Family",
        "Grandma's",
        "Grandpa's",
        "Mom's",
        "Dad's",
        "Ancestral",
        "My own",
    ];

    // please mind my EXTREME hardcoding here :) don't worry i did make a script to get these values
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

    const typeOptions = [
        "Childhood", "Crazy", "Crime", "Family", "Fantasy", "Fiction", "Food", "Funny", "Happy", "Heartwarming", "Horror", "Inspired By True Story", "Magic", "Mythology", "Oral Tradition", "Romantic", "Sad",
        "Science Fiction", "Success", "True Crime", "True Story", "War"
    ];

    const toggleAncestry = (a) => {
        if (ancestry.includes(a)) {
            setAncestry(ancestry.filter((t) => t !== a));
        } else {
            setAncestry([a]);
        }
    };

    const toggleOrigin = (flag) => {
        if (origins.includes(flag)) {
            setOrigins(origins.filter((origin) => origin !== flag));
        } else if (origins.length < 3) {
            moveOriginToFront(flag);
            setOrigins([...origins, flag]);
        }
    };

    const moveOriginToFront = (selectedOrigin) => {
        let newOriginOptions = {
            ...originOptions,
        };

        delete newOriginOptions[selectedOrigin];

        newOriginOptions = {
            [selectedOrigin]: originOptionsSource[selectedOrigin],
            ...originOptions,
        };

        setOriginOptions(newOriginOptions);
    };

    const toggleType = (type) => {
        if (types.includes(type)) {
            setTypes(types.filter((t) => t !== type));
        } else if (types.length < 3) {
            setTypes([...types, type]);
        }
    };

    return (
        <Box>
            <ModalHeader fontWeight={"bold"} fontSize={"2xl"} pb={"0px"} textAlign="center">
                Select Story Tags
            </ModalHeader>

            <ModalBody>

                <Text fontWeight={"semibold"} fontSize={"xl"} color="gray.700" pb={"10px"}>
                    Select Post Privacy
                </Text>

                <Select required fontSize={"xl"} fontWeight={"normal"} size={"lg"} value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value='public'>Post to community (anyone can see)</option>
                    <option value='connections'>Post to connections (friends & family)</option>
                    <option value='book'>Post only to storybook</option>
                </Select>
                

                <Text fontWeight={"normal"} fontSize={"xl"} color="gray.700" pb={"10px"}>
                    Select tags to help others, and yourself, to find your post better! Tags are optional, but highly recommended.
                </Text>
                <VStack spacing={4}>

                    {/* Ancestry */}
                    <FormControl id="ancestry">
                        <FormLabel fontWeight={"semibold"} fontSize={"xl"}>Ancestry / Source (Select one)</FormLabel>
                        <Box spacing={4}>
                            {ancestryOptions.map((a) => (
                                <Button
                                    key={a}
                                    margin={"3px"}
                                    size="sm"
                                    variant={ancestry.includes(a) ? "solid" : "outline"}
                                    colorScheme="blue"
                                    onClick={() => toggleAncestry(a)}
                                >
                                    <Text fontWeight={"boldish"} fontSize={"xl"}>{a}</Text>
                                </Button>
                            ))}
                        </Box>
                    </FormControl>

                    {/* Origin / Flags */}
                    <FormControl id="origin">
                        <FormLabel fontWeight={"semibold"} fontSize={"xl"}>Countries of Origin (Select up to 3)</FormLabel>
                        <InputGroup>

                            <Input
                                size="md"
                                borderRadius={"5px"}
                                pl={"8px"}
                                mb={"5px"}
                                _focus={{ borderColor: "teal.500", boxShadow: "none" }}
                                type="text"
                                fontSize={"lg"}
                                fontWeight={"boldish"}
                                placeholder="Filter by country name"
                                onChange={(e) => setFilter(e.target.value)}
                            />

                        </InputGroup>
                        <Box
                            overflowY="scroll"
                            css={{
                                "&::-webkit-scrollbar": {
                                    width: "12px",
                                    backgroundColor: "#F5F5F5",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    borderRadius: "12px",
                                    backgroundColor: "#888",
                                },
                            }}
                            spacing={4}
                            overflow="auto"
                            maxHeight="4em"
                        >

                            {Object.keys(originOptions)
                                .filter((flag) =>
                                    originOptions[flag]
                                        .toLowerCase()
                                        .includes(filter.toLowerCase())
                                )
                                .map((flag) => (
                                    <Button
                                        key={flag}
                                        margin={"4px"}
                                        size="sm"
                                        m={1}
                                        px={1}
                                        fontSize={"4xl"}
                                        variant={origins.includes(flag) ? "solid" : "outline"}
                                        colorScheme="yellow"
                                        border={false}
                                        onClick={() => toggleOrigin(flag)}
                                    >
                                        <Text>{flag}</Text>
                                    </Button>
                                ))}
                        </Box>
                    </FormControl>

                    {/* Type */}
                    <FormControl id="type">
                        <FormLabel fontWeight={"semibold"} fontSize={"xl"}>Story Genre / Theme (Select up to 3)</FormLabel>
                        <Box
                            overflowY="scroll"
                            css={{
                                "&::-webkit-scrollbar": {
                                    width: "12px",
                                    backgroundColor: "#F5F5F5",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    borderRadius: "12px",
                                    backgroundColor: "#888",
                                },
                            }}
                            spacing={4}
                            overflow="auto"
                            maxHeight="8em"
                        >
                            {typeOptions.map((type) => (
                                <Button
                                    key={type}
                                    margin={"3px"}
                                    size="sm"
                                    variant={types.includes(type) ? "solid" : "outline"}
                                    colorScheme="purple"
                                    onClick={() => toggleType(type)}
                                >
                                    <Text fontWeight={"boldish"} fontSize={"xl"}>{type}</Text>
                                </Button>
                            ))}
                        </Box>
                    </FormControl>
                </VStack>

            </ModalBody>

            <ModalFooter mt={2} mb={2} width={"100%"} justifyContent={"center"}>
                <Button fontSize={"xl"} width={"100%"} colorScheme="blue" mr={2} onClick={goBack}>
                    Go Back
                </Button>
                <Button fontSize={"xl"} width={"100%"} colorScheme="green" ml={2} mr={2} onClick={onSubmit}>
                    Post
                </Button>
                <Button fontSize={"xl"} width={"100%"} ml={2} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }} onClick={onClose}>Cancel</Button>
            </ModalFooter>

        </Box>
    );
};

export default SelectStoryTags;