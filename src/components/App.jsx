import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Registration from "./Registration";
import '../style.css';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [authUserInfo, setAuthUserInfo] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const getStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/status', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      setAuthenticated(data.isAuthenticated);
      setAuthUserInfo(data.user);
    } catch (err) {
      console.error(err);
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
            <Route path="/" element={isAuthenticated ? <Home
              setAuthenticated={setAuthenticated}
              authUserInfo={authUserInfo}
              confirmMessage={confirmMessage}
              setConfirmMessage={setConfirmMessage}
            /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={!isAuthenticated ? <Login
              confirmMessage={confirmMessage}
            /> : <Navigate to="/" replace />} />
            <Route path="/registration" element={<Registration
              setAuthenticated={setAuthenticated}
              setAuthUserInfo={setAuthUserInfo}
              setConfirmMessage={setConfirmMessage}
            />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
