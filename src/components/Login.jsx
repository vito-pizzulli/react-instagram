import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function Login({ setAuthenticated, setAuthUserInfo, setConfirmMessage }) {
    const [serverInternalError, setServerInternalError] = useState('');
    const navigate = useNavigate();

    function handleClick() {
        navigate('/registration');
    };

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObject),
                credentials: 'include'
            });
            const data = await response.json();
            setServerInternalError('');

            if (!response.ok) {
                
                if (data.message) {
                    setServerInternalError(data.message);
                }
            } else {
                setConfirmMessage(data.message);
                setAuthUserInfo(data.user);
                setAuthenticated(true);
                navigate('/');
            }

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='authentication'>
            <div className='login-area'>
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    {serverInternalError && <p>{serverInternalError}</p>}
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' />
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' />
                    <button type='submit'>Accedi</button>
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