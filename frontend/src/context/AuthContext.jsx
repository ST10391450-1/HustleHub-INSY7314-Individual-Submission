import {
    useEffect,
    useState
} from 'react';

import { AuthContext } from './AuthContextDefinition';

import {
    getToken,
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser
} from '../services/authService';


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
            } catch {
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