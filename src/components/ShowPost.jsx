import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import Loading from './Loading';
import '../style.css';

function ShowPost() {
    const { serverUrl, setConfirmMessage } = useAuth();
    const { setServerInternalError } = useErrors();
    const [post, setPost] = useState({});
    const [postLoading, setPostLoading] = useState(false);
    const { username, slug } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        setPostLoading(true);
        const getSinglePost = async () => {
            try {
                const response = await fetch(`${serverUrl}api/posts/${username}/${slug}`, {
                method: 'GET',
                credentials: 'include',
                });
                const result = await response.json();

                if (response.status === 404) {
                    setPost({})
                } else {
                    setPost(result);
                }
                setPostLoading(false);

            } catch (err) {
                setPostLoading(false);
                console.error(err);
                setServerInternalError('Si è verificato un errore durante il recupero del post.');
            }
        };
        
        getSinglePost();
    }, [ username, slug, serverUrl, setServerInternalError ]);

    async function handlePostDelete() {
        const isConfirmed = window.confirm("Sei sicuro di voler eliminare questo post? Questa azione non può essere annullata.");

        if (isConfirmed) {
            try {
                const response = await fetch(`${serverUrl}api/deletePost/${post.id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const data = await response.json();

                if (!response.ok) {
                    setServerInternalError(data.message || 'Si é verificato un errore non specificato.');
                    return;
                }
                setConfirmMessage(data.message);
                navigate('/');
    
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div className='show-post'>
            { !postLoading ?
                (Object.keys(post).length !== 0 ? (
                    <>  
                        <Link to={`/${post.username}`}>{post.username}</Link>
                        <p>{post.location}</p>
                        <img src={`${serverUrl}${post.image_url}`} alt="Post Pic" />
                        <p>{post.description}</p>
                        <button type='button' onClick={handlePostDelete}>Elimina Post</button>
                    </>
                ) : (
                    <p>Post non trovato.</p>
                ))
            : <Loading />}
        </div>
    )
};

export default ShowPost;