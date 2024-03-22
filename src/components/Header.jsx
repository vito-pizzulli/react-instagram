// Importing necessary hooks, component, styles and asset.
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import SearchUsers from './SearchUsers';
import styles from '../assets/styles/Header.module.scss';
import logo from '../assets/images/logo.png';

// Component function that encapsulates the logic and UI for the page header.
function Header() {

    // Destructuring authenticated status, authenticated user info and server ur, along with setConfirmMessage function from useAuth custom hook.
    const { isAuthenticated, authUserInfo, serverUrl, setConfirmMessage } = useAuth();

    // Destructuring setServerInternalError function from useErrors custom hook.
    const { setServerInternalError } = useErrors();

    // Initializing the navigate function from React Router for managing navigation.
    const navigate = useNavigate();

    // Function for resetting confirm message and server internal error fields and navigating to a specific path.
    function handleNavigation(path) {
        setConfirmMessage('');
        setServerInternalError('');
        navigate(path);
    };

    return (
        <header className='bg-light position-fixed w-100'>
            <div className="container-fluid p-2">
                <div className="row align-items-center">
                    <div className="col-4 d-flex justify-content-center align-items-center">
                        <img className='w-100 object-fit-contain' role='button' src={logo} alt='Logo' onClick={() => handleNavigation('/')} />
                    </div>
                    {isAuthenticated && (authUserInfo.username && authUserInfo.name && authUserInfo.profile_pic_url) ? 
                        <div className='col-5'>
                            <SearchUsers />
                        </div> 
                    : null}
                    {isAuthenticated && (authUserInfo.username && authUserInfo.name && authUserInfo.profile_pic_url) ?
                        <div className={'col-3 d-flex justify-content-center align-items-center'} role='button' onClick={() => handleNavigation(`/${authUserInfo.username}`)}>
                            <div className="row">
                                <div className="col-12 col-sm-4 d-flex justify-content-center align-items-center">
                                    <img className='object-fit-cover rounded-circle' src={`${serverUrl}${authUserInfo.profile_pic_url}`} alt='Profile Pic' />
                                </div>
                                <div className="d-none d-sm-flex col-8">
                                    <div className='d-flex flex-column justify-content-center align-content-center p-1'>
                                        <p>{authUserInfo.username}</p>
                                        <p className={styles.name}>{authUserInfo.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    : null}
                </div>
            </div>
        </header>
    );
}

export default Header;
