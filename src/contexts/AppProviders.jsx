// Importing context providers.
import { AuthProvider } from './AuthContext';
import { ErrorsProvider } from './ErrorsContext';

// Component that serves as a wrapper for context providers. It allows the nested components to have access to the contexts provided by AuthProvider and ErrorsProvider.
function AppProviders({ children }) {
    return (
        <AuthProvider>
            <ErrorsProvider>
                {children}
            </ErrorsProvider>
        </AuthProvider>
    );
}

export default AppProviders;