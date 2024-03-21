import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import Loading from "./Loading";
import PostCardsContainer from './PostCardsContainer';
import styles from '../assets/styles/UserProfile.module.scss';

function UserProfile() {
    const { serverUrl, confirmMessage, setConfirmMessage, setAuthenticated, authUserInfo } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
    const [postCards, setPostCards] = useState([]);
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [elementsLoading, setElementsLoading] = useState(false);
    const [numberOfPosts, setNumberOfPosts] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setServerInternalError();
        setElementsLoading(true);
        const getUserByUsername = async () => {
            try {
                const response = await fetch(`${serverUrl}api/${username}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const result = await response.json();

                if(response.status === 404) {
                    navigate('/not-found');
                }
                setUser(result[0]);
                
            } catch (err) {
                console.error(err);
                setServerInternalError("Si è verificato un errore durante il recupero dei dati dell'utente.");
            }
        };

        getUserByUsername();

        const getUserPosts = async () => {
            try {
                const response = await fetch(`${serverUrl}api/userPosts/${username}`, {
                method: 'GET',
                credentials: 'include',
                });
                const result = await response.json();

                if (response.status === 404) {
                    setPostCards([])
                } else {
                    setPostCards(result);
                    setNumberOfPosts(result.length);
                }
                setElementsLoading(false);

            } catch (err) {
                setElementsLoading(false);
                console.error(err);
                setServerInternalError('Si è verificato un errore durante il recupero dei post.');
            }
        };
        
        getUserPosts();
    }, [ username, serverUrl, setServerInternalError, navigate ]);

    function handleSettingsNavigation() {
        navigate('/settings');
    }

    async function handleLogout(event) {
        event.preventDefault();

        try {
            const response = await fetch(`${serverUrl}api/logout`, { method: 'POST',
            credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                setServerInternalError(data.message || 'Si é verificato un errore non specificato.');
                return;
            }
            setServerInternalError('');
            setConfirmMessage(data.message);
            setAuthenticated(false);
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    }
    
    return (
        <div className={`${styles.userProfile} userProfile container-fluid`}>
            {confirmMessage && <p className='alert alert-success'>{confirmMessage}</p>}
            {(serverInternalError && serverInternalError !== 'Nessun utente trovato.') && <p>{serverInternalError}</p>}
            {!elementsLoading ? (
                user ? (
                    <>
                        <div className="row p-5 mb-5">
                            <div className="col-12 col-md-5 d-flex justify-content-center align-items-center">
                                <img className={`${styles.profilePic} object-fit-cover rounded-circle mb-5`} src={`${serverUrl}${user.profile_pic_url}?timestamp=${new Date().getTime()}`} alt="Profile Pic" />
                            </div>
                            <div className="col-12 col-md-7">
                                <div className="row mb-3">
                                    <div className="col-12 d-flex flex-column flex-md-row justify-content-center justify-content-md-start align-items-start">
                                        <h2 className='mb-3 me-md-4 fs-4'>{user.username || 'username'}</h2>
                                        {user.username === authUserInfo.username &&
                                            <>
                                                <button className='mb-2 mb-md-0 me-md-4 btn btn-light fw-semibold' onClick={handleSettingsNavigation}>Modifica profilo</button>
                                                <button className='btn btn-light fw-semibold' onClick={handleLogout}>Logout</button>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-4 d-flex justify-content-between">
                                        <span><strong className='fs-5 fw-semibold'>{numberOfPosts}</strong> post</span>
                                        <span><strong className='fs-5 fw-semibold'>0</strong> follower</span>
                                        <span><strong className='fs-5 fw-semibold'>0</strong> seguiti</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-xl-6">
                                                <p className='fw-semibold'>{user.name || 'name'}</p>
                                                <p className={`${styles.bio}`}>{user.bio || ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {postCards.length > 0 ? (
                                <PostCardsContainer postCards={postCards} />
                            ) : (
                                <>
                                    <i className="fa-solid fa-camera fs-3 border border-black rounded-circle w-auto m-auto p-3"></i>
                                    <p className='fs-3 text-center fw-bold'>Ancora nessun post</p>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <p className='alert alert-danger'>Utente non trovato.</p>
                )
            ) : <Loading />}
        </div>
    );
}

export default UserProfile;