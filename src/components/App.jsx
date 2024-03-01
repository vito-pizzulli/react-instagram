import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Registration from "./Registration";
import CompleteRegistration from "./CompleteRegistration";
import '../style.css';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [authUserInfo, setAuthUserInfo] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const serverUrl = 'http://localhost:3001/';
  const [serverInternalError, setServerInternalError] = useState('');
  const [serverValidationErrors, setServerValidationErrors] = useState([]);

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

const requiresCompleteRegistration = () => {
  return isAuthenticated && (!authUserInfo.username || !authUserInfo.name || !authUserInfo.profile_pic_url);
};

  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              requiresCompleteRegistration() ?
              <Navigate to="/complete-registration" replace /> :
              isAuthenticated ?
              <Home
                serverUrl={serverUrl}
                serverInternalError={serverInternalError}
                setServerInternalError={setServerInternalError}
                setAuthenticated={setAuthenticated}
                authUserInfo={authUserInfo}
                confirmMessage={confirmMessage}
                setConfirmMessage={setConfirmMessage}
              /> : <Navigate to="/login" replace />}
            />

            <Route path="/login" element={
              !isAuthenticated ?
              <Login
                serverUrl={serverUrl}
                serverInternalError={serverInternalError}
                setServerInternalError={setServerInternalError}
                setAuthenticated={setAuthenticated}
                setAuthUserInfo={setAuthUserInfo}
                confirmMessage={confirmMessage}
                setConfirmMessage={setConfirmMessage}
              /> : <Navigate to="/" replace />}
            />

            <Route path="/registration" element={
              <Registration
                serverUrl={serverUrl}
                serverInternalError={serverInternalError}
                setServerInternalError={setServerInternalError}
                serverValidationErrors={serverValidationErrors}
                setServerValidationErrors={setServerValidationErrors}
                setAuthenticated={setAuthenticated}
                setAuthUserInfo={setAuthUserInfo}
                setConfirmMessage={setConfirmMessage}
              />} 
            />
            
            <Route path="/complete-registration" element={
              <CompleteRegistration
                serverUrl={serverUrl}
                serverInternalError={serverInternalError}
                setServerInternalError={setServerInternalError}
                serverValidationErrors={serverValidationErrors}
                setServerValidationErrors={setServerValidationErrors}
                setAuthenticated={setAuthenticated}
                authUserInfo={authUserInfo}
                setAuthUserInfo={setAuthUserInfo}
                setConfirmMessage={setConfirmMessage}
              />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
