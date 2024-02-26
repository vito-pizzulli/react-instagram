import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function Home({ setAuthenticated, authUserInfo, confirmMessage, setConfirmMessage }) {
    const navigate = useNavigate();
    const [logoutErrorMessage, setLogoutErrorMessage] = useState('');

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/logout', { method: 'GET',
            credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                setLogoutErrorMessage(data.message || 'Errore non specificato.');
                return;
            }
            setLogoutErrorMessage('');
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

            <h2>Benvenuto, {authUserInfo.username}!</h2>
            <p>Email: {authUserInfo.email}</p>
            <p>Nome: {authUserInfo.name}</p>

            {logoutErrorMessage && <p>{logoutErrorMessage}</p>}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Home;
