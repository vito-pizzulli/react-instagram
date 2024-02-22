import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Registration from "./Registration";
import '../style.css';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const getStatus = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/status', {
          method: 'GET',
          credentials: 'include'
        });
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
            <Route path="/" element={isAuthenticated ? <Home authenticatedFalse={() => setAuthenticated(false)} /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/registration" element={<Registration authenticatedTrue={() => setAuthenticated(true)} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
