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
