import { createContext, useContext, useState, useEffect } from "react";

import { extendTheme } from "@chakra-ui/react";

import { useUser } from "./UserContext";

import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

// const ThemeContext = createContext();

// export const useTheme = () => {
//     return useContext(ThemeContext);
// };

export const ThemeProvider = () => {

    const { user, setUser } = useUser();

    const [theme, setTheme] = useState(getExtendedTheme(1.2, 500, cofcream));

    useEffect(() => {
        const fetchUserSettings = () => {
            if (user) {
                const unsubscribe = onSnapshot(
                    doc(db, "settings", user.uid),
                    (userSettingsDoc) => {
                        if (userSettingsDoc.exists()) {
                            const userSettingsData = userSettingsDoc.data();
                            const fontSizeMultiplier = parseFloat(userSettingsData.fontSize);
                            const fontWeight = parseFloat(userSettingsData.fontWeight);
                            const colorTheme = userSettingsData.colorTheme;
                            let chosenTheme = (colorTheme === "cof") ? cofcream : periwinkle;
                            setTheme(getExtendedTheme(fontSizeMultiplier, fontWeight, chosenTheme));
                        } else {
                            setTheme(getExtendedTheme(1.2, 500, cofcream));
                        }
                    },
                    (error) => {
                        console.error("Error fetching user settings:", error);
                    }
                );
                return unsubscribe;
            } else {
                setTheme(getExtendedTheme(1.2, 500, cofcream));
            }
        };

        const unsubscribe = fetchUserSettings();
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    return theme;
};

export const getExtendedTheme = (fontSizeMultiplier, fontWeight, colorTheme) => {
    const theme = extendTheme({
        // fonts: {
        //     body: "system-ui, sans-serif",
        //     heading: "Georgia, serif",
        // }, 
        // NOTE THAT #A94929 WAS ACTUALLY A PRETTY DECENT BG COLOR!

        colors: colorTheme,
        fontSizes: {
            xs: `calc(0.75rem * ${fontSizeMultiplier})`,
            sm: `calc(0.875rem * ${fontSizeMultiplier})`,
            md: `calc(1rem * ${fontSizeMultiplier})`,
            lg: `calc(1.125rem * ${fontSizeMultiplier})`,
            xl: `calc(1.25rem * ${fontSizeMultiplier})`,
            "2xl": `calc(1.5rem * ${fontSizeMultiplier})`,
            "3xl": `calc(1.875rem * ${fontSizeMultiplier})`,
            "4xl": `calc(2.25rem * ${fontSizeMultiplier})`,
            "5xl": `calc(3rem * ${fontSizeMultiplier})`,
            "6xl": `calc(3.75rem * ${fontSizeMultiplier})`,
            "7xl": `calc(4.5rem * ${fontSizeMultiplier})`,
            "8xl": `calc(6rem * ${fontSizeMultiplier})`,
            "9xl": `calc(8rem * ${fontSizeMultiplier})`,
        },
        fontWeights: {
            normal: fontWeight,
            boldish: `calc(100 + ${fontWeight})`,
            semibold: `calc(200 + ${fontWeight})`,
            bold: `calc(300 + ${fontWeight})`,
        },
    });
    return theme;
};

const periwinkle = {
    profileText: "#171923",
    profilePrivacyText: "#B83280",
    navText: "#F7FAFC",
    feedWindowHeaderText: "#FFFFFF",

    addButtonBG: "#6666DF",
    addButtonBGHover: "#5858C2",
    addButtonText: "#FFFFFF",

    mainBG: "#EAEAFF",
    navBG: "#5858C2",

    feedWindowHeader: "#6666DF",
    connectionsButton: "#6666DF",
    connectionsButtonHover: "#4646B5",

    postBG: "#FAF5FF",
    postDividers: "#DDDDF7",
    postDividersBtwn: "#E8E8FE",
    postContentBG: "#FBFBFF",
    commentInputBG: "#F8F8FF",
    commentInputBorder: "#DDDDF7",

    chatBG: "#FAF5FF",

    modalCloseButtonBG: "#CBD5E0",
    modalCloseButtonBGHover: "#A0AEC0",
    modalCloseButtonText: "#171923",

    step1: '#FCFCFF',
    step2: '#F1F1FF',
    step3: '#E8E8FF',
    step4: '#DEDEFF',
    step5: '#CCCCFF'
}

const cofcream = {
    profileText: "#F7FAFC",
    profilePrivacyText: "#FB80BC",
    navText: "#F7FAFC",
    feedWindowHeaderText: "#FFFFFF",

    addButtonBG: "#A9714B",
    addButtonBGHover: "#996949",
    addButtonText: "#FFFFFF",

    mainBG: "#53433A",
    navBG: "#94684A",

    feedWindowHeader: "#A9714B",
    connectionsButton: "#A9714B",
    connectionsButtonHover: "#855230",

    postBG: "#FFF5E2",
    postDividers: "#FEEBC8",
    postDividersBtwn: "#FEEBC8",
    postContentBG: "#FFFAF0",
    commentInputBG: "#FFFAF0",
    commentInputBorder: "#FEEBC8",

    chatBG: "#FFFAF0",

    modalCloseButtonBG: "#CBD5E0",
    modalCloseButtonBGHover: "#A0AEC0",
    modalCloseButtonText: "#171923",

    step1: '#fffaf0',
    step2: '#f8efe2',
    step3: '#f1e3d4',
    step4: '#ead8c7',
    step5: '#e2ccb9'
}



// some of these are blue, theyre ok, ig...
// colors: {
//     profileText: "#171923",
//     navText: "#F7FAFC",
//     feedWindowHeaderText: "#FFFFFF",
//     mainBG: "#E4F3FE", 
//     navBG: "#1F7ABE", 
//     feedWindowHeader: "#3893D7",
//     connectionsButton: "#3893D7",
//     connectionsButtonHover: "#1F7ABE",
//     postBG: "#FFF5E2",
//     postDividers: "#FBD38D",
//     postDividersBtwn: "#FEEBC8",
//     postContentBG: "#FFFAF0",
//     commentInputBG: "#FFFAF0",
//     commentInputBorder: "#FEEBC8",
//   },