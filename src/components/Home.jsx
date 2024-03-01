import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import '../style.css';

function Home() {
    const { serverUrl, setAuthenticated, authUserInfo, confirmMessage, setConfirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
    const navigate = useNavigate();

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
        <div className='homepage'>
            {confirmMessage && <p>{confirmMessage}</p>}

            <h2>Ciao, {authUserInfo.username || 'username'}!</h2>
            <p>Email: {authUserInfo.email || 'email'}</p>
            <p>Nome: {authUserInfo.name || 'name'}</p>
            <img src={`${serverUrl}${authUserInfo.profile_pic_url}`} alt="Profile Pic" />

            {serverInternalError && <p>{serverInternalError}</p>}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Home;
