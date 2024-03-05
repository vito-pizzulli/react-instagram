import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../style.css';

function Home() {
    const { confirmMessage, setConfirmMessage } = useAuth();
    const navigate = useNavigate();

    function handleAddPostNavigation() {
        setConfirmMessage('');
        navigate('/add-post');
    };
    
    return (
        <div className='homepage'>
            {confirmMessage && <p>{confirmMessage}</p>}
            <button onClick={handleAddPostNavigation}>Nuovo Post</button>
            <h2>Homepage</h2>
        </div>
    );
}

export default Home;
