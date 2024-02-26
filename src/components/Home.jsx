import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function Home({ setAuthenticated }) {
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
            setAuthenticated(false);
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    }
    
    return (
        <div className='homepage'>
            <h1>Homepage</h1>
            {logoutErrorMessage && <p>{logoutErrorMessage}</p>}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Home;
