import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import '../style.css';

function SearchUsers() {
    const [searchWord, setSearchWord] = useState('');
    const [foundUsers, setFoundUsers] = useState([]);
    const { serverUrl } = useAuth();
    const { serverInternalError, setServerInternalError } = useErrors();
    const navigate = useNavigate();

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
    }, [searchWord, serverUrl, setServerInternalError]);

    const handleSearchChange = (e) => {
        setSearchWord(e.target.value);
    };

    const handleUserClick = (username) => {
        setSearchWord('');
        navigate(`/${username}`);
    };

    return (
        <div className='search-users'>
        {serverInternalError && <p>{serverInternalError}</p>}
            <input
                type="text"
                placeholder='Cerca'
                value={searchWord}
                onChange={handleSearchChange}
            />
            {foundUsers.length > 0 && (
                <ul>
                    {foundUsers.map(user => (
                        <li key={user.id} onClick={() => handleUserClick(user.username)}>
                            <p>{user.username}</p>
                            <img src={`${serverUrl}${user.profile_pic_url}`} alt="Profile Pic" />
                            <p>{user.name}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchUsers;