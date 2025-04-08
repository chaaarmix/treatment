import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import QueryProvider from "./utils/QueryProvider";
import * as serviceWorkerRegistration from './serviceWorker'; // Импортируем serviceWorker

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryProvider>
            <App />
        </QueryProvider>
    </React.StrictMode>
);

// Регистрируем service worker
serviceWorkerRegistration.register({
    onSuccess: (registration) => {
        console.log("Service Worker зарегистрирован успешно", registration);
    },
    onUpdate: (registration) => {
        console.log("Новый контент доступен. Регистрируем новый сервис-воркер", registration);
    },
});
