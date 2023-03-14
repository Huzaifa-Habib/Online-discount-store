import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ContextProvider from "./context/context"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthProvider } from 'firebase/auth';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="129952501937-1911462c8gbd0upi4ptqne8l7vs8itkg.apps.googleusercontent.com" >
      <ContextProvider>
        <BrowserRouter>   
            <App />
        </BrowserRouter>
      </ContextProvider>
    </GoogleOAuthProvider>
   
   
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();