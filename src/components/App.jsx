// Importing necessary hooks and components.
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

// Component function that wraps the main application logic.
function App() {

   // Destructuring authentication and loading state, along with setter functions from useAuth custom hook.
  const { serverUrl, isAuthenticated, setAuthenticated, authUserInfo, setAuthUserInfo, isLoading, setIsLoading } = useAuth();

  // Destructuring setServerInternalError function from useErrors custom hook.
  const { setServerInternalError } = useErrors();

  // Initializing useEffect hook to perform actions on component mount.
  useEffect(() => {

    // Asynchronous function to fetch authentication status from the server.
    const getStatus = async () => {
      try {
        const response = await fetch(`${serverUrl}api/status`, {
          method: 'GET',
          credentials: 'include', // Includes credentials to ensure cookies are sent with the request.
        });
        const data = await response.json();

        // Updating authentication and user info state based on server response.
        setAuthenticated(data.isAuthenticated);
        setAuthUserInfo(data.user);
        setIsLoading(false); // Setting loading to false after fetching data.

      } catch (err) {
        console.error(err);

        // Setting server error state in case of request failure.
        setServerInternalError('Si è verificato un errore durante il recupero dello stato di autenticazione.');
      }
    };
  
    getStatus();
  }, [ serverUrl, setAuthenticated, setAuthUserInfo, setServerInternalError, setIsLoading ]);
  
  // Function to determine if the user needs to complete their registration (if Sign in with Google was used to authenticate).
  const requiresCompleteRegistration = () => {
    return isAuthenticated && (!authUserInfo.username || !authUserInfo.name || !authUserInfo.profile_pic_url);
  };

  return (
    <Router>
      <div>
        <Header />
        <main>

          {/* Define routes and their components, with redirection based on authentication. The Loading component is rendered until the other one is ready. */}
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
