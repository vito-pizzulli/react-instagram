// Importing necessary hooks and components.
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from "../contexts/ErrorsContext";
import PostsContainer from './PostsContainer';
import Loading from "./Loading";

// Component function that encapsulates the logic and UI for the site home page.
function Home() {

    // Destructuring server url and confirm message, along with setConfirmMessage function from useAuth custom hook.
    const { serverUrl, confirmMessage, setConfirmMessage } = useAuth();

    // Destructuring server internal error, along with his setter function from useErrors custom hook.
    const { serverInternalError, setServerInternalError } = useErrors();

    // Initializing state management.
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);

    // Initializing the navigate function from React Router for managing navigation.
    const navigate = useNavigate();

    // Initializing useEffect hook to perform actions on component mount.
    useEffect(() => {
        setServerInternalError();

        // Asynchronous function to load all the users posts from the server.
        const getAllPosts = async () => {

            // Attempt to send a GET request to the server and handle response or errors.
            try {
                const response = await fetch(`${serverUrl}api/posts`, {
                method: 'GET',
                credentials: 'include' // Includes credentials to ensure cookies are sent with the request.
                });
                const result = await response.json();

                if (response.status === 404) {
                    setPosts([])
                } else {
                    setPosts(result);
                }
                setPostsLoading(false);
                
            } catch (err) {
                setPostsLoading(false);
                console.error(err);
                setServerInternalError('Si è verificato un errore durante il recupero dei post.');
            }
        };
        
        getAllPosts();
    }, [ serverUrl, setServerInternalError ]);

    // Handler for the navigation to the path for adding a new post.
    function handleAddPostNavigation() {
        setConfirmMessage('');
        navigate('/add-post');
    };
    
    return (
        <div className={`homepage container-fluid`}>
            {confirmMessage && <p className="alert alert-success">{confirmMessage}</p>}
            {(serverInternalError && serverInternalError !== 'Nessun utente trovato.') && <p className="alert alert-danger">{serverInternalError}</p>}
            {!postsLoading ? (
                posts.length > 0 ? (
                    <>
                        <button className="btn btn-dark rounded-5 mb-5" onClick={handleAddPostNavigation}><i className="fa-solid fa-plus"></i> Crea un nuovo post</button>
                        <PostsContainer posts={posts} />
                    </>
                ) : (
                    <p className="alert alert-info">Ancora nessun post.</p>
                )
            ) : <Loading />}
        </div>
    );
}

export default Home;
