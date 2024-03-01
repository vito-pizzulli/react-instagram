import { AuthProvider } from './AuthContext';
import { ErrorsProvider } from './ErrorsContext';

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