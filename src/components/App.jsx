import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Registration from "./Registration";
import CompleteRegistration from "./CompleteRegistration";
import UserProfile from "./UserProfile";
import AuthUserSettings from "./AuthUserSettings";
import Loading from "./Loading";
import AddPost from "./AddPost";
import ShowPost from "./ShowPost";
import NotFound from "./NotFound";
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from "../contexts/ErrorsContext";
import '../style.css';

function App() {

  const { serverUrl, isAuthenticated, setAuthenticated, authUserInfo, setAuthUserInfo, isLoading, setIsLoading } = useAuth();
  const { setServerInternalError } = useErrors();

  useEffect(() => {
    setIsLoading(true);
    const getStatus = async () => {
      try {
        const response = await fetch(`${serverUrl}api/status`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setAuthenticated(data.isAuthenticated);
        setAuthUserInfo(data.user);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setServerInternalError('Si è verificato un errore durante il recupero dello stato di autenticazione.');
      }
    };
  
    getStatus();
  }, [ serverUrl, setAuthenticated, setAuthUserInfo, setServerInternalError, setIsLoading ]);
  
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
              isLoading ? <Loading /> :
              requiresCompleteRegistration() ?
                <Navigate to="/complete-registration" replace /> :
              isAuthenticated ?
                <Home /> : <Navigate to="/login" replace />}
            />

            <Route path="/login" element={
              !isAuthenticated ?
                <Login /> : <Navigate to="/" replace />}
            />

            <Route path="/registration" element={
              <Registration />} 
            />
            
            <Route path="/complete-registration" element={
              <CompleteRegistration />}
            />

            <Route path="/:username" element={
              isLoading ? <Loading /> :
              requiresCompleteRegistration() ?
                <Navigate to="/complete-registration" replace /> :
              isAuthenticated ?
                <UserProfile /> : <Navigate to="/login" replace />}
            />

            <Route path="/settings" element={
              isLoading ? <Loading /> :
              requiresCompleteRegistration() ?
                <Navigate to="/complete-registration" replace /> :
              isAuthenticated ?
                <AuthUserSettings /> : <Navigate to="/login" replace />}
            />

            <Route path="/add-post" element={
              isLoading ? <Loading /> :
              requiresCompleteRegistration() ?
                <Navigate to="/complete-registration" replace /> :
              isAuthenticated ?
                <AddPost /> : <Navigate to="/login" replace />}
            />

            <Route path="/:username/:slug" element={
              isLoading ? <Loading /> :
              requiresCompleteRegistration() ?
                <Navigate to="/complete-registration" replace /> :
              isAuthenticated ?
                <ShowPost /> : <Navigate to="/login" replace />}
            />

            <Route path="/not-found" element={
              <NotFound />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
