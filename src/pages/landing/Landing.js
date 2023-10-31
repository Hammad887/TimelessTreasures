// Timeless Treasures by Team Elderly Frogs @ UC Berkeley
// Team Members: Bhada Yun, Emily Lee, Hammad Afzal
// This is the App.js file, basically the "FATHER COMPONENT" of everything
// Useful to set up things like routing and user states here for now.

import React from "react";

import { Box, useDisclosure } from '@chakra-ui/react';
import ContactUs from "./ContactUs";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar.js";
import Testimonials from "./Testimonials";

export default function Landing() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box>
            <Navbar onOpen={onOpen} />
            <Box bg={'#FFEDD6'}>
                <Hero />
                <Testimonials />
                <ContactUs />
                <Footer />
            </Box>
        </Box>
    );
}

