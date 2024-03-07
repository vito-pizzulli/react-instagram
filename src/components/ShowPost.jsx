import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import Loading from './Loading';
import '../style.css';

function ShowPost() {
    const { serverUrl } = useAuth();
    const { setServerInternalError } = useErrors();
    const [post, setPost] = useState({});
    const [postLoading, setPostLoading] = useState(false);
    const { username, slug } = useParams();

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

    return (
        <div className='show-post'>
            { !postLoading ?
                (Object.keys(post).length !== 0 ? (
                    <>  
                        <Link to={`/${post.username}`}>{post.username}</Link>
                        <p>{post.location}</p>
                        <img src={`${serverUrl}${post.image_url}`} alt="Post Pic" />
                        <p>{post.description}</p>
                    </>
                ) : (
                    <p>Post non trovato.</p>
                ))
            : <Loading />}
        </div>
    )
};

export default ShowPost;