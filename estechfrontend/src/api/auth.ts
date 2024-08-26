import axios from './axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useAuthStore } from '@stores/auth';

interface LoginResponse {
    access: string;
    refresh: string;
}

interface RegisterResponse {
    data: unknown;
    error: string | null | any;
}

interface TokenData {
    exp: number;
    user_id: string;
    username: string;
}

export const login = async (username: string, password: string): Promise<RegisterResponse> => {
    try {
        const { data, status } = await axios.post<LoginResponse>('users/token/', {
            username,
            password,
        });

        if (status === 200) {
            setAuthUser(data.access, data.refresh);
        }

        return { data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data?.detail || 'Что-то пошло не так',
        };
    }
};

export const register = async (
    username: string,
    email: string,
    password: string,
    password2: string,
    firstName: string,
    lastName: string
): Promise<RegisterResponse> => {
    try {
        const { data } = await axios.post('users/register/', {
            username,
            email,
            password,
            password2,
            first_name: firstName,
            last_name: lastName,
        });
        await login(username, password);
        return { data, error: null };
    } catch (error: any) {
        return {
            data: null,
            error: error.response?.data || 'Что-то пошло не так',
        };
    }
};

export const logout = (): void => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    useAuthStore.getState().setUser(null);
};

export const setUser = async (): Promise<void> => {
    const accessToken = localStorage.getItem('access_token') || '';
    const refreshToken = localStorage.getItem('refresh_token') || '';
    if (!accessToken || !refreshToken) {
        return;
    }
    if (isAccessTokenExpired(accessToken)) {
        const response = await getRefreshToken(refreshToken);
        setAuthUser(response.access, response.refresh);
    } else {
        setAuthUser(accessToken, refreshToken);
    }
};

export const setAuthUser = (access_token: string, refresh_token: string): void => {
    Cookies.set('access_token', access_token, {
        expires: 1,
        secure: true,
    });

    Cookies.set('refresh_token', refresh_token, {
        expires: 7,
        secure: true,
    });

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    const user = jwtDecode<TokenData>(access_token) ?? null;

    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async (refreshToken: string): Promise<LoginResponse> => {
    const response = await axios.post<{ access: string; refresh: string }>('users/token/refresh/', {
        refresh: refreshToken,
    });
    return response.data;
};

export const isAccessTokenExpired = (accessToken: string): boolean => {
    try {
        const decodedToken = jwtDecode<TokenData>(accessToken);
        return decodedToken.exp < Date.now() / 1000;
    } catch (err) {
        return true; // Токен недействителен или истек
    }
};
