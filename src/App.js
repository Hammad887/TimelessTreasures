// Timeless Treasures by Team Elderly Frogs @ UC Berkeley
// Team Members: Bhada Yun, Emily Lee, Hammad Afzal
// This is the App.js file, basically the "FATHER COMPONENT" of everything
// Useful to set up things like routing and user states here for now.

import React, { useEffect, useRef, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import { Navigate } from 'react-router-dom';

import Home from "./pages/main/Home";
import Profile from "./pages/main/Profile";

import About from "./pages/landing/About";
import Advice from "./pages/main/Advice";
import Recipes from "./pages/main/Recipes";
import Stories from "./pages/main/Stories";

import Login from "./pages/onboarding/Login";
import Onboarding from "./pages/onboarding/Onboarding";
import Signup from "./pages/onboarding/Signup";

import AdvicePost from "./components/main/advice/AdvicePost";
import RecipePost from "./components/main/recipe/RecipePost";
import StoryPost from "./components/main/story/StoryPost";

import Chatbot from "./Chatbot";

import { useDisclosure } from '@chakra-ui/react';
import Landing from "./pages/landing/Landing";

import Chats from "./pages/main/Chats";
import SpecificChatScreen from "./components/main/chat/SpecificChatScreen";

import { useUser } from "./UserContext";

import { ThemeProvider, useTheme } from "./ThemeContext";
import Settings from "./components/accessibility/Settings";
import Privacy from "./components/accessibility/Privacy";

function App() {
    
    const { user, setUser } = useUser();

    const theme = ThemeProvider();

    const [onboarded, setOnboarded] = useState(false);

    useEffect(() => {
        if (user) {
            const getOnboardedStatus = async () => {
                try {
                    const profileRef = doc(db, "users", user.uid);
                    const profileDoc = await getDoc(profileRef);

                    if (profileDoc.exists()) {
                        const username = profileDoc.data().username || null;
                        setOnboarded(username != null);
                    } else {
                        setOnboarded(false);
                    }
                } catch (error) {
                    console.log("Error getting onboarded status:", error);
                }
            };
            getOnboardedStatus();
        }
    }, [user]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <ChakraProvider theme={theme}>
            <Router>
                {user && onboarded ? (
                    <Routes>
                        <Route path="/" element={<Home email={user.email} />} />
                        <Route path="/profile/:id" element={<Profile />} />
                        <Route path="/recipes" element={<Recipes />} />
                        <Route path="/stories" element={<Stories />} />
                        <Route path="/advice" element={<Advice />} />
                        <Route path="/chat" element={<Chats />} />
                        <Route path="/chat/:id" element={<SpecificChatScreen />} />
                        {/* <Route path="/chat/:id" element={<ChatScreen />} /> */}
                        <Route path="/recipe/:id" element={<RecipePost />} />
                        <Route path="/advice/:id" element={<AdvicePost />} />
                        <Route path="/story/:id" element={<StoryPost />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                ) : (
                    <Routes>
                        <Route path="/profile/:id" element={<Landing />} />
                        <Route path="/recipes" element={<Landing />} />
                        <Route path="/stories" element={<Landing />} />
                        <Route path="/advice" element={<Landing />} />
                        <Route path="/chat" element={<Landing />} />
                        <Route path="/chat/:id" element={<Landing />} />
                        {/* <Route path="/chat/:id" element={<ChatScreen />} /> */}
                        <Route path="/recipe/:id" element={<Landing />} />
                        <Route path="/advice/:id" element={<Landing />} />
                        <Route path="/story/:id" element={<Landing />} />
                        <Route path="*" element={<Navigate to="/" />} />

                        <Route path="/" element={<Landing onOpen={onOpen} />} />
                        <Route path="/about" element={<About onOpen={onOpen} />} />

                        {!user && <Route path="/" element={<Landing onOpen={onOpen} />} />}
                        {!user && <Route path="/about" element={<About onOpen={onOpen} />} />}
                        {!user && <Route path="/signup" element={<Signup />} />}
                        {!user && <Route path="/login" element={<Login />} />}

                        {!user && <Route path="/onboarding" element={<Signup />} />}
                        {user && <Route path="/onboarding" element={<Onboarding setOnboarded={setOnboarded} />} />}

                        {user && !onboarded && <Route path="*" element={<Navigate to="/onboarding" />} />}

                        {!user && <Route path="*" element={<Navigate to="/" />} />}
                    </Routes>
                )}
            </Router>
            { user ? <Settings /> : null }
            {/* { user ? <Privacy /> : null } */}
        </ChakraProvider>
    );
}

export default App;