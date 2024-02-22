import { useNavigate } from 'react-router-dom';
import '../style.css';

function Home({ authenticatedFalse }) {
    const navigate = useNavigate();

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/logout', { method: 'GET',
            credentials: 'include'
        });

            if (response.ok) {
                authenticatedFalse();
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Errore durante il logout.');
        }
    }
    
    return (
        <div className='homepage'>
            <h1>Homepage</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Home;
