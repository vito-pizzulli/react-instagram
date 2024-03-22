// Import necessary hooks.
import { createContext, useContext, useState } from 'react';

// Create a new Context for managing errors. This will be used to provide and consume error state.
const ErrorsContext = createContext();

// Custom hook for easy consumption of ErrorsContext in the components.
function useErrors() {
    return useContext(ErrorsContext);
}

// Provider component that encapsulates the logic for managing error states and provides it to all child components.
function ErrorsProvider({ children }) {

    // State for managing a generic server internal error message.
    const [serverInternalError, setServerInternalError] = useState('');

    // State for managing an array of server validation errors, useful for forms and other input validation feedback.
    const [serverValidationErrors, setServerValidationErrors] = useState([]);

    // Object that contains all the state and functions related to errors, which will be made available to consuming components.
    const value = {
        serverInternalError,
        setServerInternalError,
        serverValidationErrors,
        setServerValidationErrors
    };

    // Component that provides the `value` object to all children components. This enables any child component within the application to access and manage error states.
    return <ErrorsContext.Provider value={value}>{children}</ErrorsContext.Provider>;
};

// Export the custom hook and the provider so they can be used throughout the application.
export { useErrors, ErrorsProvider };