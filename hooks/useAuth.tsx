import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authStorage, loginAPI, signupAPI } from '../services/auth';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 🔥 AUTO LOGIN
    useEffect(() => {
        const init = async () => {
            const { token, user } = await authStorage.get();
            if (token && user) {
                setUser(user);
                router.replace('/(tabs)');
            }
            setLoading(false);
        };
        init();
    }, []);

    // 🔐 LOGIN
    const login = async (payload: any) => {
        const data = await loginAPI(payload);
        await authStorage.save(data.token, data.user);
        setUser(data.user);
        router.replace('/(tabs)');
    };

    // 📝 SIGNUP
    const signup = async (payload: any) => {
        await signupAPI(payload);
        router.replace('/login');
    };

    // 🚪 LOGOUT
    const logout = async () => {
        await authStorage.clear();
        setUser(null);
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);