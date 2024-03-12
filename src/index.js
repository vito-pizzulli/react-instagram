import React from 'react';
import { createRoot } from "react-dom/client";
import App from './components/App';
import AppProviders from './contexts/AppProviders';
import 'bootstrap/dist/css/bootstrap.css';
import './style.scss';

const root = createRoot(document.getElementById("root"));
root.render(
    <AppProviders>
        <App />
    </AppProviders>
);