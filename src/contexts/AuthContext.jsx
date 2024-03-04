import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [authUserInfo, setAuthUserInfo] = useState({});
    const [confirmMessage, setConfirmMessage] = useState('');
    const serverUrl = 'http://localhost:3001/';

    const value = {
        isAuthenticated,
        setAuthenticated,
        authUserInfo,
        setAuthUserInfo,
        confirmMessage,
        setConfirmMessage,
        serverUrl
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth, AuthProvider };