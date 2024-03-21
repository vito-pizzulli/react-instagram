import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from "../contexts/ErrorsContext";
import PostsContainer from './PostsContainer';
import Loading from "./Loading";

function Home() {
    const { serverUrl, confirmMessage, setConfirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setServerInternalError();
        setPostsLoading(true);
        const getAllPosts = async () => {
            try {
                const response = await fetch(`${serverUrl}api/posts`, {
                method: 'GET',
                credentials: 'include',
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
