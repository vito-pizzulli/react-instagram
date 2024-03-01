import { createContext, useContext, useState } from 'react';

const ErrorsContext = createContext();

function useErrors() {
    return useContext(ErrorsContext);
}

function ErrorsProvider({ children }) {
    const [serverInternalError, setServerInternalError] = useState('');
    const [serverValidationErrors, setServerValidationErrors] = useState([]);

    const value = {
        serverInternalError,
        setServerInternalError,
        serverValidationErrors,
        setServerValidationErrors
    };

    return <ErrorsContext.Provider value={value}>{children}</ErrorsContext.Provider>;
};

export { useErrors, ErrorsProvider };