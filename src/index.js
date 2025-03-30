import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import QueryProvider from "./utils/QueryProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryProvider>
        <App />
        </QueryProvider>
    </React.StrictMode>
);