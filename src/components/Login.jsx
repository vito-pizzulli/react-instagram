import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import styles from '../assets/styles/Forms.module.scss';
import logo from '../assets/images/logo.png';
import loginImage from '../assets/images/login-image.png';
import googlePlay from '../assets/images/google-play.png';
import appStore from '../assets/images/app-store.png';

function Login() {
    const { serverUrl, setAuthenticated, setAuthUserInfo, setConfirmMessage, confirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleRegistrationNavigation() {
        setConfirmMessage('');
        setServerInternalError('');
        navigate('/registration');
    };

    function handleGoogleLogin() {
        window.location.href = `${serverUrl}auth/google`;
    };

    function resetPassword() {
        setPassword('');
    };

    async function handleLogin(event) {
        event.preventDefault();

        setConfirmMessage('');
        setServerInternalError('');
        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());
        setEmail(formDataObject.email);
        setPassword(formDataObject.password);

        if (!formDataObject.email.trim() || !formDataObject.password.trim()) {
            setServerInternalError("E-mail e password sono campi obbligatori.");
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
        <div className={`${styles.authentication} authentication container-fluid d-flex justify-content-center align-items-center`}>
            <div className="row">
                <div className="d-none d-lg-flex col-6 justify-content-center align-items-start align-items-lg-center">
                    <img className='w-75' src={loginImage} alt="Phone showing Instagram" />
                </div>
                <div className="col-12 col-lg-6 d-flex flex-column justify-content-center">
                    <div className='loginArea d-flex flex-column align-items-center border border-secondary-subtle p-5 mb-3'>
                        <form className='d-flex flex-column justify-content-center align-items-center' onSubmit={handleLogin}>
                            <img className='w-50 mb-4' src={logo} alt="Instagram Logo" />
                            {confirmMessage && <p className='alert alert-success w-100'>{confirmMessage}</p>}
                            {serverInternalError && <p className='alert alert-warning w-100'>{serverInternalError}</p>}
                            <input
                                className='w-100 rounded-1'
                                type="email"
                                name='email'
                                value={email}
                                placeholder='E-mail'
                                onChange={event => setEmail(event.target.value)}
                            />
                            <input
                                className='w-100 rounded-1 mb-3'
                                type="password"
                                name='password'
                                value={password}
                                placeholder='Password'
                                onChange={event => setPassword(event.target.value)}
                            />
                            <button className='w-100 mb-3 btn btn-primary fw-semibold border-0' type='submit'>Accedi</button>
                        </form>
                        <div className="row w-100 mb-4">
                            <div className="col-5">
                                <hr />
                            </div>
                            <div className="col-2 text-center">
                                <span className={`${styles.separator} fs-5`}>o</span>
                            </div>
                            <div className="col-5">
                                <hr />
                            </div>
                        </div>
                        <span className='fw-semibold' role='button' onClick={handleGoogleLogin}><i className="fa-brands fa-google me-2"></i> Accedi con Google</span>
                    </div>
                    <div className='registrationArea border border-secondary-subtle p-4 text-center mb-4'>
                        <span>Non hai un account? </span>
                        <span className={`${styles.registrationLink} fw-semibold`} role='button' onClick={handleRegistrationNavigation}>Iscriviti</span>
                    </div>
                    <div className={styles.appDownload}>
                        <div className="row text-center mb-3">
                            <div className="col-12">
                                <span>Scarica l'applicazione.</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 d-flex justify-content-end">
                            <a href="https://play.google.com/store/apps/details?id=com.instagram.android&hl=it&gl=US" target="_blank" rel="noopener noreferrer">
                                <img src={googlePlay} alt="Download from Google Play Logo" />
                            </a>
                            </div>
                            <div className="col-6 d-flex justify-content-start">
                                <a href="https://apps.apple.com/it/app/instagram/id389801252" target="_blank" rel="noopener noreferrer">
                                    <img src={appStore} alt="Download from App Store Logo." />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;