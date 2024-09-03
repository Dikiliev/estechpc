import axios from 'axios';
import { apiInstance } from './index';
import { LoginRequest, LoginResponse, RegisterRequest } from '@src/types';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    errors?: Record<string, string[]>;
}

export const login = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
        const response = await apiInstance.post<LoginResponse>('/users/token/', data);
        return { success: true, data: response.data };
    } catch (error: unknown) {
        console.error(error);
        return handleApiError<LoginResponse>(error);
    }
};

export const register = async (data: RegisterRequest): Promise<ApiResponse<void>> => {
    try {
        await apiInstance.post('/users/register/', data);
        return { success: true };
    } catch (error: unknown) {
        return handleApiError<void>(error);
    }
};

export const refreshToken = async (refresh: string): Promise<ApiResponse<string>> => {
    try {
        const response = await apiInstance.post<{ access: string }>('/users/token/refresh/', { refresh });
        return { success: true, data: response.data.access };
    } catch (error: unknown) {
        return handleApiError<string>(error);
    }
};

const handleApiError = <T>(error: unknown): ApiResponse<T> => {
    if (axios.isAxiosError(error) && error.response) {
        const responseErrors = error.response.data as Record<string, string[]>;
        const formattedErrors: Record<string, string[]> = {};

        if (typeof responseErrors === 'string') {
            formattedErrors['non_field_errors'] = [responseErrors];
        } else {
            for (const key in responseErrors) {
                if (Array.isArray(responseErrors[key])) {
                    formattedErrors[key] = responseErrors[key];
                } else {
                    formattedErrors[key] = [responseErrors[key]];
                }
            }
        }
        return { success: false, errors: formattedErrors };
    } else {
        return { success: false, errors: { non_field_errors: ['Something went wrong. Please try again.'] } };
    }
};
