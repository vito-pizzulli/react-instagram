import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import '../style.css';

function Login() {
    const { serverUrl, setAuthenticated, setAuthUserInfo, setConfirmMessage, confirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleRegistrationNavigation() {
        setConfirmMessage('');
        navigate('/registration');
    };

    function handleGoogleLogin() {
        window.location.href = `${serverUrl}auth/google`;
    };

    function resetPassword() {
        setPassword('');
    };

    async function handleSubmit(event) {
        event.preventDefault();

        setConfirmMessage('');
        setServerInternalError('');
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());
        console.log(formDataObject);
        setEmail(formDataObject.email);
        setPassword(formDataObject.password);

        if (!formDataObject.email.trim() || !formDataObject.password.trim()) {
            setServerInternalError("Email e password sono campi obbligatori.");
            return;
        }

        try {
            const response = await fetch(`${serverUrl}api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObject),
                credentials: 'include'
            });
            const data = await response.json();

            if (!response.ok) {
                resetPassword();

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
    };

    return (
        <div className='authentication'>
            <div className='login'>
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    {confirmMessage && <p>{confirmMessage}</p>}
                    {serverInternalError && <p>{serverInternalError}</p>}
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name='email'
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password"
                        name='password'
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />
                    <button type='submit'>Accedi</button>
                </form>
                <button onClick={handleGoogleLogin}>Accedi con Google</button>
            </div>
            <div className='registration-area'>
                <h2>Non sei ancora registrato?</h2>
                <button onClick={handleRegistrationNavigation}>Registrati ora</button>
            </div>
        </div>
    );
}

export default Login;