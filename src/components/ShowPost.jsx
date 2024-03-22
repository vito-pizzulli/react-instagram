// Importing necessary hooks, components, library and styles.
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import moment from 'moment';
import 'moment/locale/it';
import Loading from './Loading';
import ConfirmWindow from './ConfirmWindow';
import styles from '../assets/styles/ShowPost.module.scss';

// Component function that encapsulates the logic and UI for the page that shows a single post.
function ShowPost() {

    // Destructuring authenticated user info and server url, along with setConfirmMessage function from useAuth custom hook.
    const { authUserInfo, serverUrl, setConfirmMessage } = useAuth();

    // Destructuring server internal error, along with his setter function from useErrors custom hook.
    const { serverInternalError, setServerInternalError } = useErrors();

    // Initializing state management.
    const [post, setPost] = useState({});
    const [postLoading, setPostLoading] = useState(true);
    const [confirmWindowVisible, setConfirmWindowVisible] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState();

    // Destructuring to extract 'username' and 'slug' values from the URL parameters using the useParams hook from React Router.
    const { username, slug } = useParams();

    // Initializing the navigate function from React Router for managing navigation.
    const navigate = useNavigate();

    // Initializing useEffect hook to perform actions on component mount.
    useEffect(() => {
        setPostLoading(true);

        // Asynchronous function to fetch and load the single post's info from the server.
        const getSinglePost = async () => {

            // Attempt to send a GET request to the server and handle response or errors.
            try {
                const response = await fetch(`${serverUrl}api/posts/${username}/${slug}`, {
                credentials: 'include' // Includes credentials to ensure cookies are sent with the request.
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

        // Asynchronous function to handle post deletion confirmation.
        const deletePostIfConfirmed = async () => {

            // If the user has confirmed, attempt to send a DELETE request to the server and handle response or errors.
            if (isConfirmed) {
                try {
                    const response = await fetch(`${serverUrl}api/deletePost/${post.id}`, {
                        method: 'DELETE',
                        credentials: 'include' // Includes credentials to ensure cookies are sent with the request.
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        setServerInternalError(data.message || 'Si é verificato un errore non specificato.');
                        return;
                    }
                    setConfirmMessage(data.message);
                    navigate('/'); // Redirect to Home page on success.
        
                } catch (err) {
                    console.error(err);
                }
            }
        };
        
        getSinglePost();
        deletePostIfConfirmed();
    }, [ username, slug, serverUrl, setServerInternalError, isConfirmed, navigate, post.id, setConfirmMessage ]);

    // Function to make the confirm window visible.
    function handlePostDelete() {
        setConfirmWindowVisible(true);
    };

    // Function to format the date in italian format.
    function formatDate(date) {
        moment.locale('it');
        return moment(date).format('D MMMM YYYY');
    };

    const formattedDate = formatDate(post.created_at);

    return (
        <div className={`${styles.showPost} showPost container-fluid`}>
            {serverInternalError && <p className='alert alert-warning'>{serverInternalError}</p>}
            { !postLoading ?
                (Object.keys(post).length !== 0 ? (

                    <div className="row">
                        <div className={`${styles.borderMd} col-12 col-xxl-9 d-flex justify-content-center`}>
                            <img className={`${styles.postPic} object-fit-contain`} src={`${serverUrl}${post.image_url}`} alt="Post Pic" />
                        </div>
                        <div className="col-12 col-xxl-3 p-0 d-flex flex-column">

                            <div className={`${styles.borderMd} row p-3 m-0`}>
                                <div className="col-3 text-center">
                                    <Link to={`/${post.username}`}>
                                        <img className={`${styles.profilePic} object-fit-cover rounded-circle`} src={`${serverUrl}${post.profile_pic_url}`} alt="Profile Pic" />
                                    </Link>
                                </div>
                                <div className="col-9 d-flex flex-column">
                                    <Link className='text-decoration-none text-black fw-semibold' to={`/${post.username}`}>{post.username}</Link>
                                    <span className={`${styles.location} mb-3`}>{post.location}</span>
                                    {post.username === authUserInfo.username &&
                                        <button className={`${styles.delete} btn fw-semibold w-100`} type='button' onClick={handlePostDelete}>Elimina</button>
                                    }
                                </div>
                            </div>
                            
                            <div className={`${styles.postInfoContainer} ${styles.borderMd} row p-3 m-0 h-100 d-flex flex-column justify-content-between`}>

                                <div className="row m-0 p-0 mb-4">
                                    <div className="col-3 z-1 text-center">
                                        <Link to={`/${post.username}`}>
                                            <img className={`${styles.profilePic} object-fit-cover rounded-circle`} src={`${serverUrl}${post.profile_pic_url}`} alt="Profile Pic" />
                                        </Link>
                                    </div>
                                    <div className="col-9 d-flex flex-column">
                                        <p className={`${styles.description} d-inline`}>
                                            <Link className='text-decoration-none text-black fw-semibold' to={`/${post.username}`}>{post.username}</Link> {post.description}
                                        </p>
                                        <span className={`${styles.date} mb-3`}>{formattedDate}</span>
                                    </div>
                                </div>

                                <div className="row align-items-center m-0 p-0 pb-2 flex-column">
                                    <div className="col-12 d-flex justify-content-start">
                                        <i className={`${styles.postIcon} fa-regular fa-heart`}></i>
                                        <i className={`${styles.postIcon} fa-regular fa-comment`}></i>
                                        <i className={`${styles.postIcon} fa-regular fa-bookmark`}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                ) : (
                    <p className='alert alert-danger'>Post non trovato.</p>
                ))
            : <Loading />}

            { confirmWindowVisible &&
                <ConfirmWindow
                    message="Sei sicuro di voler eliminare questo post? Questa azione non può essere annullata."
                    setIsConfirmed={setIsConfirmed}
                    setConfirmWindowVisible={setConfirmWindowVisible}
                />
            }
        </div>
    )
};

export default ShowPost;