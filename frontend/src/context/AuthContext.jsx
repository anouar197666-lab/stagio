import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            if (isTokenExpired(token)) {
                logout();
            } else {
                fetchUser();
            }
        } else {
            setLoading(false);
        }
    }, []);

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (err) {
            return true;
        }
    };

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.data);
        } catch (err) {
            console.error(err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        await fetchUser();
        return res.data.role;
    };

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        localStorage.setItem('token', res.data.token);
        await fetchUser();
        return res.data.role;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};
