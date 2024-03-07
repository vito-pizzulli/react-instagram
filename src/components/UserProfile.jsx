import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import Loading from "./Loading";
import PostCardsContainer from './PostCardsContainer';
import '../style.css';

function UserProfile() {
    const { serverUrl, confirmMessage, authUserInfo } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
    const [postCards, setPostCards] = useState([]);
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [postCardsLoading, setPostCardsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserByUsername = async () => {
            try {
                const response = await fetch(`${serverUrl}api/${username}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const result = await response.json();
                setUser(result[0]);
            } catch (err) {
                console.error(err);
                setServerInternalError("Si è verificato un errore durante il recupero dei dati dell'utente.");
            }
        };
        if(username) {
            getUserByUsername();
        } else {
            navigate('/not-found');
        }

        setPostCardsLoading(true);
        const getUserPosts = async () => {
            try {
                const response = await fetch(`${serverUrl}api/userPosts/${username}`, {
                method: 'GET',
                credentials: 'include',
                });
                const result = await response.json();
                setPostCardsLoading(false);
                setPostCards(result);
            } catch (err) {
                console.error(err);
                setServerInternalError('Si è verificato un errore durante il recupero dei post.');
            }
        };
        
        getUserPosts();
    }, [ username, serverUrl, setServerInternalError, navigate ]);

    function handleSettingsNavigation() {
        navigate('/settings');
    }
    
    return (
        <div className='user-profile'>
            {confirmMessage && <p>{confirmMessage}</p>}
            {serverInternalError && <p>{serverInternalError}</p>}
            {user ? (
                <>
                    <h2>{user.username || 'username'}</h2>
                    <p>{user.name || 'name'}</p>
                    <img src={`${serverUrl}${user.profile_pic_url}?timestamp=${new Date().getTime()}`} alt="Profile Pic" />
                    <p>{user.bio || 'Nessuna bio inserita.'}</p>
                    {user.username === authUserInfo.username &&
                        <button onClick={handleSettingsNavigation}>Modifica i tuoi dati</button>
                    }
                    {!postCardsLoading ? <PostCardsContainer postCards={postCards} /> : <Loading />}
                </>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default UserProfile;