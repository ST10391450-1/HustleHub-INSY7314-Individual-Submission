
import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

import {
    getToken,
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

  
    useEffect(() => {
        const restoreSession = async () => {
            if (!getToken()) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                logoutUser();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (credentials) => {
        const result = await loginUser(credentials);

        setUser(result.user);

        return result;
    };

    const register = async (userData) => {
        return await registerUser(userData);
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used within an AuthProvider.'
        );
    }

    return context;
};