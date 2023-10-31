// AddRecipe.js

import React, { useEffect, useState } from "react";

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button
} from "@chakra-ui/react";

import { useNavigate } from 'react-router-dom';

import { auth } from "../../firebase.js";

const HandleLogout = ( { cancelConfirmation, setCancelConfirmation } ) => {
        
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const [alertErrors, setAlertErrors] = useState([]);

    const cancelRef = React.useRef()

    const handleAlertClose = () => {
        setCancelConfirmation(false);
    };

    return (
            
        <AlertDialog
            isOpen={cancelConfirmation}
            leastDestructiveRef={cancelRef}
            initialFocusRef={cancelRef}
            onClose={handleAlertClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent top={"22%"}>
                    <AlertDialogHeader fontWeight={"bold"} fontSize={"xl"} pb={"0px"}>Are you sure you want to logout?</AlertDialogHeader>
                        <AlertDialogBody fontWeight={"boldish"} fontSize={"lg"} pb={"0px"}>You can sign back in on the homepage.</AlertDialogBody>
                    <AlertDialogFooter mb={2} width={"100%"} justifyContent={"center"}>
                        <Button width={"100%"} fontSize={"xl"} colorScheme="red" mr={3} onClick={handleLogout}>Yes</Button>
                        <Button width={"100%"} fontSize={"xl"} bg={"modalCloseButtonBG"} color={"modalCloseButtonText"} _hover={{ bg: "modalCloseButtonBGHover" }} autoFocus ref={cancelRef} onClick={() => setCancelConfirmation(false)}>No</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>

    );
}

export default HandleLogout;