import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import '../style.css';

function Header() {
    const { isAuthenticated, setAuthenticated, authUserInfo, serverUrl, setConfirmMessage } = useAuth();
    const { setServerInternalError } = useErrors();
    const navigate = useNavigate();

    function handleNavigation(path) {
        setConfirmMessage('');
        navigate(path);
    };

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
        <header>
            <h1>Instagram</h1>
            {isAuthenticated && (authUserInfo.username && authUserInfo.name && authUserInfo.profile_pic_url) ? <button onClick={() => handleNavigation('/')}>Home</button> : null}
            {isAuthenticated && (authUserInfo.username && authUserInfo.name && authUserInfo.profile_pic_url) ? <button onClick={() => handleNavigation(`/${authUserInfo.username}`)}>Il mio profilo</button> : null}
            {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
        </header>
    );
}

export default Header;
