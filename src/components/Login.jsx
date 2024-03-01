import { useNavigate } from 'react-router-dom';
import '../style.css';

function Login({ serverUrl, serverInternalError, setServerInternalError, setAuthenticated, setAuthUserInfo, setConfirmMessage, confirmMessage }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate('/registration');
    };

    function handleGoogleLogin() {
        window.location.href = `${serverUrl}auth/google`;
    };

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());
        const { email, password } = formDataObject;

        if (!email.trim() || !password.trim()) {
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
    };

    return (
        <div className='authentication'>
            <div className='login-area'>
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    {confirmMessage && <p>{confirmMessage}</p>}
                    {serverInternalError && <p>{serverInternalError}</p>}
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' />
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' />
                    <button type='submit'>Accedi</button>
                </form>
                <button onClick={handleGoogleLogin}>Accedi con Google</button>
            </div>
            <div className='registration-area'>
                <h2>Non sei ancora registrato?</h2>
                <button onClick={handleClick}>Registrati ora</button>
            </div>
        </div>
    );
}

export default Login;