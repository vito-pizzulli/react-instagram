import { useAuth } from '../contexts/AuthContext';
import '../style.css';

function Home() {
    const { confirmMessage } = useAuth();
    
    return (
        <div className='homepage'>
            {confirmMessage && <p>{confirmMessage}</p>}

            <h2>Homepage</h2>
        </div>
    );
}

export default Home;
