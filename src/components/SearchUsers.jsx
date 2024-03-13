import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import styles from '../assets/styles/SearchUsers.module.scss';

function SearchUsers() {
    const [searchWord, setSearchWord] = useState('');
    const [foundUsers, setFoundUsers] = useState([]);
    const { serverUrl } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
    const navigate = useNavigate();
    const dropdownMenu = useRef(null);

    const debounce = (func, delay) => {
        let inDebounce;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
    };

    useEffect(() => {
        const doSearch = async () => {
            if (searchWord.trim() !== '') {
                try {
                    const response = await fetch(`${serverUrl}api/searchUsers/${encodeURIComponent(searchWord.trim())}`);
                    const data = await response.json();

                    if (response.status === 404) {
                        setFoundUsers([]);
                        setServerInternalError(data.message)
                    } else {
                        setFoundUsers(data);
                        setServerInternalError('');
                    }

                } catch (err) {
                    console.error(err);
                    setServerInternalError('Si è verificato un errore durante il recupero del post.');
                }
            } else {
                setFoundUsers([]);
            }
        };

        const debouncedSearch = debounce(doSearch, 500);
        debouncedSearch();

        const handleClickOutside = (event) => {
            if (dropdownMenu.current && !dropdownMenu.current.contains(event.target)) {
                setFoundUsers([]);
                setServerInternalError('');
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchWord, serverUrl, setServerInternalError, dropdownMenu]);

    const handleSearchChange = (e) => {
        setSearchWord(e.target.value);
    };

    const handleUserClick = (username) => {
        setSearchWord('');
        navigate(`/${username}`);
    };

    return (
        <div className='row justify-content-center position-relative'>
            <div className="col-12 p-0">
                <input
                    className='w-100 rounded'
                    type="text"
                    placeholder='Cerca'
                    value={searchWord}
                    onChange={handleSearchChange}
                />

                {foundUsers.length === 0 && serverInternalError && (
                    <ul className={`position-absolute list-group w-100`} ref={dropdownMenu}>
                        {serverInternalError !== '' && <li className='list-group-item'>{serverInternalError}</li>}
                    </ul>
                )}

                {foundUsers.length > 0 && (
                    <ul className={`${styles.foundUsers} position-absolute list-group w-100`} ref={dropdownMenu}>
                        {foundUsers.map(user => (
                            <li className='list-group-item' key={user.id} onClick={() => handleUserClick(user.username)}>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-5 col-md-3 d-flex justify-content-start align-items-center">
                                                <img className='object-fit-cover rounded-circle' src={`${serverUrl}${user.profile_pic_url}`} alt='Profile Pic' />
                                            </div>
                                            <div className="col-7 col-md-9 d-flex flex-column justify-content-center align-items-start overflow-hidden">
                                                <p className='overflow-hidden'>{user.username}</p>
                                                <p className={`${styles.name} overflow-hidden`}>{user.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default SearchUsers;