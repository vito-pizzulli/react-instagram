import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from "../contexts/ErrorsContext";
import PostsContainer from './PostsContainer';
import Loading from "./Loading";
import '../style.css';

function Home() {
    const { serverUrl, confirmMessage, setConfirmMessage } = useAuth();
    const { setServerInternalError } = useErrors();
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
        <div className='homepage'>
            {confirmMessage && <p>{confirmMessage}</p>}
            <button onClick={handleAddPostNavigation}>Nuovo Post</button>
            {!postsLoading ? (
                posts.length > 0 ? (
                    <PostsContainer posts={posts} />
                ) : (
                    <p>Ancora nessun post.</p>
                )
            ) : <Loading />}
        </div>
    );
}

export default Home;
