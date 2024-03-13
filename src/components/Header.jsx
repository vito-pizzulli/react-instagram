import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchUsers from './SearchUsers';
import styles from '../assets/styles/Header.module.scss';
import logo from '../assets/images/logo.png';

function Header() {
    const { isAuthenticated, authUserInfo, serverUrl, setConfirmMessage } = useAuth();
    const navigate = useNavigate();

    function handleNavigation(path) {
        setConfirmMessage('');
        navigate(path);
    };

    return (
        <header className='d-flex align-items-center overflow-hidden'>
            <div className="container-fluid w-md-75 h-100">
                <div className="row align-items-center h-100">
                    <div className="col-4 d-flex justify-content-center align-items-center h-100">
                        <img className='w-100 mh-100 object-fit-contain' role='button' src={logo} alt='Logo' onClick={() => handleNavigation('/')} />
                    </div>
                    {isAuthenticated && (authUserInfo.username && authUserInfo.name && authUserInfo.profile_pic_url) ? 
                        <div className='col-4'>
                            <SearchUsers />
                        </div> 
                    : null}
                    {isAuthenticated && (authUserInfo.username && authUserInfo.name && authUserInfo.profile_pic_url) ?
                        <div className={'col-4 d-flex justify-content-center align-items-center h-100'} role='button' onClick={() => handleNavigation(`/${authUserInfo.username}`)}>
                            <div className="row h-100">
                                <div className="col-12 col-sm-4 d-flex justify-content-center align-items-center h-100">
                                    <div className={`${styles.profilePicContainer} h-75`}>
                                        <img className='object-fit-cover rounded-circle w-100 h-100' src={`${serverUrl}${authUserInfo.profile_pic_url}`} alt='Profile Pic' />
                                    </div>
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
