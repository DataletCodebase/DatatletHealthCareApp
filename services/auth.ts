import AsyncStorage from '@react-native-async-storage/async-storage';

const API = "http://YOUR_IP:PORT/api/auth"; // 🔥 change this

export const authStorage = {
    save: async (token: string, user: any) => {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
    },

    get: async () => {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        return { token, user: user ? JSON.parse(user) : null };
    },

    clear: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
    },
};

// 🔐 LOGIN API
export const loginAPI = async (payload: any) => {
    const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
};

// 📝 SIGNUP API
export const signupAPI = async (payload: any) => {
    const res = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
};