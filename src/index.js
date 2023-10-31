import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { UserProvider } from "./UserContext";

import Kommunicate from '@kommunicate/kommunicate-chatbot-plugin';
import { ThemeProvider } from '@chakra-ui/react';
Kommunicate.init("125162388b5e17b2de4abf0ccead3c45d", {})

// const theme = extendTheme({
//   fonts: {
//     body: "Lato, sans-serif",
//     heading: "Lato, sans-serif",
//     },
// })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
        <App />
    </UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
