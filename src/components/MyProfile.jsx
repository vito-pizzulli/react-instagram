import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import Loading from "./Loading";
import PostCardsContainer from './PostCardsContainer';
import '../style.css';

function MyProfile() {
    const { serverUrl, setAuthenticated, authUserInfo, confirmMessage, setConfirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
    const [postCards, setPostCards] = useState([]);
    const [postCardsLoading, setPostCardsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setPostCardsLoading(true);
        const getUserPosts = async () => {
            try {
                const response = await fetch(`${serverUrl}api/userPosts`, {
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
    }, [ serverUrl, setServerInternalError ]);

    function handleSettingsNavigation() {
        navigate('settings');
    }

    async function handleLogout(event) {
        event.preventDefault();

        try {
            const response = await fetch(`${serverUrl}api/logout`, { method: 'GET',
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
        <div className='my-profile'>
            {confirmMessage && <p>{confirmMessage}</p>}
            {serverInternalError && <p>{serverInternalError}</p>}
            <h2>{authUserInfo.username || 'username'}</h2>
            <p>{authUserInfo.name || 'name'}</p>
            <img src={`${serverUrl}${authUserInfo.profile_pic_url}?timestamp=${new Date().getTime()}`} alt="Profile Pic" />
            <p>{authUserInfo.bio || 'Nessuna bio inserita.'}</p>
            <button onClick={handleSettingsNavigation}>Modifica i tuoi dati</button>
            <button onClick={handleLogout}>Logout</button>
            { !postCardsLoading ?
                <PostCardsContainer
                    postCards={postCards}
                />
            : <Loading />}
        </div>
    );
}

export default MyProfile;