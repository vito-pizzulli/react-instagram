import React, { useState, useEffect } from "react";
import '../style.css';

function Header() {
    const [message, setMessage] = useState("");

    function getMessage() {
        fetch('http://localhost:3001/api/message')
        .then(response => response.json())
        .then(data => setMessage(data.message))
        .catch(error => console.error("Error during API call:", error));
    }

    useEffect(() => {
        getMessage();
    }, []);

    return (
        <div>
            <h1>Message from server: {message ? message : "I'm offline!"}</h1>
        </div>
    );
}

export default Header;
