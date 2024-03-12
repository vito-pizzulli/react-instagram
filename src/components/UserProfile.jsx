import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import Loading from "./Loading";
import PostCardsContainer from './PostCardsContainer';

function UserProfile() {
    const { serverUrl, confirmMessage, setConfirmMessage, setAuthenticated, authUserInfo } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
    const [postCards, setPostCards] = useState([]);
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [elementsLoading, setElementsLoading] = useState(false);
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
        <div className='user-profile'>
            {confirmMessage && <p>{confirmMessage}</p>}
            {serverInternalError && <p>{serverInternalError}</p>}
            {!elementsLoading ? (
                user ? (
                    <>
                        <h2>{user.username || 'username'}</h2>
                        <p>{user.name || 'name'}</p>
                        <img src={`${serverUrl}${user.profile_pic_url}?timestamp=${new Date().getTime()}`} alt="Profile Pic" />
                        <p>{user.bio || 'Nessuna bio inserita.'}</p>
                        {user.username === authUserInfo.username &&
                            <>
                                <button onClick={handleSettingsNavigation}>Modifica i tuoi dati</button>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        }
                        {postCards.length > 0 ? (
                            <PostCardsContainer postCards={postCards} />
                        ) : (
                            <p>Ancora nessun post.</p>
                        )}
                    </>
                ) : (
                    <p>Utente non trovato.</p>
                )
            ) : <Loading />}
        </div>
    );
}

export default UserProfile;