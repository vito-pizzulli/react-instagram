import React from 'react';
import { createRoot } from "react-dom/client";
import App from './components/App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

const root = createRoot(document.getElementById("root"));
root.render(<App />);