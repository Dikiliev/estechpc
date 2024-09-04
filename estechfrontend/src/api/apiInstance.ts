import axios from 'axios';
import { API_URL } from '@utils/constans';

const apiInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Интерцептор для добавления токена авторизации в заголовок
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Интерцептор для обработки ответов и обновления токена при необходимости
apiInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Проверяем, является ли ошибка связанной с axios
        if (axios.isAxiosError(error)) {
            const isAuthRequest = originalRequest.url.includes('/users/token/');
            const isRefreshRequest = originalRequest.url.includes('/users/token/refresh/');

            // Проверяем, является ли ошибка 401, не связано ли это с попыткой авторизации, и не было ли уже попытки обновить токен
            if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest && !isRefreshRequest) {
                originalRequest._retry = true;
                try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    const response = await axios.post(`${API_URL}/users/token/refresh/`, {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access_token', response.data.access);
                    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return apiInstance(originalRequest);
                } catch (e) {
                    console.error('Ошибка при обновлении токена', e);
                    return Promise.reject(e);
                }
            }

            // Если ошибка связана с другими статусами, например, 500, 404 и т.д.
            if (error.response?.status) {
                console.error(`Ошибка ${error.response.status}: ${error.response.statusText}`);
            }
        } else {
            console.error('Неизвестная ошибка', error);
        }

        return Promise.reject(error);
    }
);

export default apiInstance;
