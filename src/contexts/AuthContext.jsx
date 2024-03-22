// Import necessary hooks.
import { createContext, useContext, useState } from 'react';

// Create a new Context for authentication data. This will be used to provide and consume authentication state throughout the application.
const AuthContext = createContext();

// Custom hook for easy consumption of AuthContext in the components.
function useAuth() {
    return useContext(AuthContext);
}

// Provider component that encapsulates the logic for managing authentication state and provides it to all child components.
function AuthProvider({ children }) {

    // State for tracking user's authentication status.
    const [isAuthenticated, setAuthenticated] = useState(false);

        // State for storing authenticated user's information.
    const [authUserInfo, setAuthUserInfo] = useState({});

        // State for managing confirmation messages across the application.
    const [confirmMessage, setConfirmMessage] = useState('');

        // State for tracking loading-related operations.
    const [isLoading, setIsLoading] = useState(true);

    // Base URL for server API requests.
    const serverUrl = 'http://localhost:3001/';

    // Object that contains all the state and functions that will be made available to consuming components.
    const value = {
        isAuthenticated,
        setAuthenticated,
        authUserInfo,
        setAuthUserInfo,
        confirmMessage,
        setConfirmMessage,
        serverUrl,
        isLoading,
        setIsLoading
    };

    // Component that provides the `value` object to all children components. This allows any child component to access the authentication state and functions.
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the custom hook and the provider to be used in the application.
export { useAuth, AuthProvider };