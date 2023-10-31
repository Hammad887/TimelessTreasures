import {
    Button,
    Flex,
    FormControl,
    Input,
    Text,
    Textarea,
    useMediaQuery,
    useToast,
} from '@chakra-ui/react';

import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

import React, { useState } from 'react';

const ContactUs = () => {

    const [isLargerThanLG] = useMediaQuery('(min-width: 62em)');
    const toast = useToast();
    const [formValues, setFormValues] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        });
    };

    const submitForm = async () => {
        try {
            const feedbackRef = collection(db, 'feedback');
            await addDoc(feedbackRef, formValues);

            toast({
                title: 'Message sent! ❤️',
                description: 'Thank you for contacting us!',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            setFormValues({
                fullName: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error sending message',
                description: 'Something went wrong, please try again later.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex
            id="contact-us"
            w="full"
            minHeight="90vh"
            py="16"
            px={isLargerThanLG ? '16' : '6'}
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
        >
            <Text
                fontSize={isLargerThanLG ? '40px' : '36px'}
                fontWeight="bold"
                mb="6"
            >
                Contact Us / Feedback
            </Text>

            <FormControl
                w={isLargerThanLG ? '60%' : 'full'}
                display="flex"
                flexDirection="column"
                alignItems="start"
            >
                <Input
                    id="fullName"
                    bg={"white"}
                    type="text"
                    placeholder="Name"
                    fontSize={"19px"}
                    mb="5"
                    h="14"
                    value={formValues.fullName}
                    onChange={handleInputChange}
                />

                <Input
                    id="email"
                    type="email"
                    bg={"white"}
                    placeholder="Email"
                    fontSize={"19px"}
                    mb="5"
                    h="14"
                    value={formValues.email}
                    onChange={handleInputChange}
                />

                <Input
                    id="subject"
                    type="text"
                    bg={"white"}
                    placeholder="Subject"
                    fontSize={"19px"}
                    mb="5"
                    h="14"
                    value={formValues.subject}
                    onChange={handleInputChange}
                />

                <Textarea
                    id="message"
                    bg={"white"}
                    placeholder="Enter a message"
                    fontSize={"19px"}
                    mb="5"
                    rows={7}
                    p="5"
                    value={formValues.message}
                    onChange={handleInputChange}
                />

                <Button
                    colorScheme="blue"
                    size="lg"
                    textAlign="left"
                    width="200px"
                    type="submit"
                    onClick={submitForm}
                    mb="6" 
                    height={"42px"} 
                    fontSize={"24px"} 
                    fontWeight={"600"}
                >
                    Submit
                </Button>
            </FormControl>
        </Flex>
    );
};

export default ContactUs;
