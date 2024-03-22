// Importing necessary hooks and styles.
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import styles from '../assets/styles/SearchUsers.module.scss';

// Component function that encapsulates the logic and UI for the component that allows the user to search for other registered users.
function SearchUsers() {

    // Destructuring server url, along with setConfirmMessage function from useAuth custom hook.
    const { serverUrl, setConfirmMessage } = useAuth();

    // Destructuring server internal error, along with his setter function from useErrors custom hook.
    const { serverInternalError, setServerInternalError } = useErrors();

    // Initializing state management.
    const [searchWord, setSearchWord] = useState('');
    const [foundUsers, setFoundUsers] = useState([]);

    // Initializing the navigate function from React Router for managing navigation.
    const navigate = useNavigate();

    // useRef hook to create a mutable object that persists for the lifetime of the component.
    const dropdownMenu = useRef(null);

    // Debounce function to limit the rate at which the function is executed.
    const debounce = (func, delay) => {
        let inDebounce;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // Initializing useEffect hook to perform actions on component mount.
    useEffect(() => {

        // Asynchronous function to search users according of the word the user inserted.
        const doSearch = async () => {

            // Attempt to send a GET request to the server and handle response or errors if the word to search is different from an empty string.
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

        // Creating a debounced version of the search function to limit the rate of search operation execution.
        const debouncedSearch = debounce(doSearch, 500);
        debouncedSearch();

        // Function that empties the found users array and makes the dropdown menu disappear if the user clicks outside it.
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

    // Function that updates the word to search when after the user has typed something.
    const handleSearchChange = (e) => {
        setSearchWord(e.target.value);
    };

    // Handler for the navigation to a user profile when the user clicks on it in the dropdown menu.
    const handleUserClick = (username) => {
        setSearchWord('');
        setConfirmMessage('');
        navigate(`/${username}`);
    };

    return (
        <div className={`${styles.searchUsers} row justify-content-center position-relative`}>
            <div className="col-12 p-0">
                <i className={`${styles.searchIcon} fa-solid fa-magnifying-glass position-absolute`}></i>
                <input
                    className={`${styles.searchUsers} w-100 rounded`}
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
                                            <div className="col-5 col-lg-2 d-flex justify-content-start align-items-center">
                                                <img className='object-fit-cover rounded-circle' src={`${serverUrl}${user.profile_pic_url}`} alt='Profile Pic' />
                                            </div>
                                            <div className="col-7 col-lg-10 d-flex flex-column justify-content-center align-items-start overflow-hidden">
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