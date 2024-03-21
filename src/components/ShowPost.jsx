import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import moment from 'moment';
import 'moment/locale/it';
import Loading from './Loading';
import styles from '../assets/styles/ShowPost.module.scss';

function ShowPost() {
    const { authUserInfo, serverUrl, setConfirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
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
                        <div className="col-12 col-xxl-9 border border-secondary-subtle">
                            <img className={`${styles.postPic}`} src={`${serverUrl}${post.image_url}`} alt="Post Pic" />
                        </div>
                        <div className="col-12 col-xxl-3 p-0 d-flex flex-column">

                            <div className="row border border-secondary-subtle p-3 m-0">
                                <div className="col-2">
                                    <img className={`${styles.profilePic} object-fit-cover rounded-circle`} src={`${serverUrl}${post.profile_pic_url}`} alt="Profile Pic" />
                                </div>
                                <div className="col-10 d-flex flex-column">
                                    <Link className='text-decoration-none text-black fw-semibold' to={`/${post.username}`}>{post.username}</Link>
                                    <span className={styles.location}>{post.location}</span>
                                </div>
                            </div>
                            
                            <div className="row border border-secondary-subtle p-3 m-0 h-100">
                                <div className="col-2">
                                    <img className={`${styles.profilePic} object-fit-cover rounded-circle`} src={`${serverUrl}${post.profile_pic_url}`} alt="Profile Pic" />
                                </div>
                                <div className="col-10 d-flex flex-column">
                                    <p className={`${styles.description} d-inline`}>
                                        <Link className='text-decoration-none text-black fw-semibold' to={`/${post.username}`}>{post.username}</Link> {post.description}
                                    </p>
                                    <span className={`${styles.date} mb-3`}>{formattedDate}</span>
                                    {post.username === authUserInfo.username &&
                                        <button className={`${styles.delete} btn fw-semibold`} type='button' onClick={handlePostDelete}>Elimina</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>  
                ) : (
                    <p className='alert alert-danger'>Post non trovato.</p>
                ))
            : <Loading />}
        </div>
    )
};

export default ShowPost;