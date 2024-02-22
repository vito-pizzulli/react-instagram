import { useNavigate } from 'react-router-dom';
import '../style.css';

function Login() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/registration');
    };

    return (
        <div className='authentication'>
            <div className='login-area'>
                <form action="" method='POST'>
                    <h2>Login</h2>
                    <label htmlFor="email">Email</label>
                    <input type="text" name='email' />
                    <label htmlFor="password">Password</label>
                    <input type="text" name='password' />
                    <button>Accedi</button>
                </form>
                <button>Accedi con Google</button>
            </div>
            <div className='registration-area'>
                <h2>Non sei ancora registrato?</h2>
                <button onClick={handleClick}>Registrati ora</button>
            </div>
        </div>
    );
}

export default Login;