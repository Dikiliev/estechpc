import axios, { AxiosInstance } from 'axios';
import { API_URL } from '@utils/constans';

const apiInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default apiInstance;
