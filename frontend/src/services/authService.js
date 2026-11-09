
import api from './api';

const TOKEN_KEY = 'hustlehub_token';

export const getToken = () => {
    return sessionStorage.getItem(TOKEN_KEY);
};

const saveToken = (token) => {
    sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
    sessionStorage.removeItem(TOKEN_KEY);
};
api.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearToken();
        }

        return Promise.reject(error);
    }
);


export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials);

    const result = response.data;
    const token = result.data?.token;

    if (!token) {
        throw new Error('Authentication token was not returned by the server.');
    }

    saveToken(token);

    return result.data;
};


export const getCurrentUser = async () => {
    const response = await api.get('/users/me');
    return response.data.data;
};

export const logoutUser = () => {
    clearToken();
};