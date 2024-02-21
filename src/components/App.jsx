import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './Header';
import Home from './Home';
import Authenticate from './Authenticate';
import '../style.css';

function App() {
  const [isAuthenticated, setAuthenticated] = useState();

  const getStatus = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/status');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAuthenticated(data.isAuthenticated);
    } catch (error) {
        console.error("Error during API call:", error);
    }
  };

useEffect(() => {
    getStatus();
}, []);

  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/authenticate" replace />} />
            <Route path="/authenticate" element={!isAuthenticated ? <Authenticate /> : <Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
