// src/stores/authStore.ts
import { makeAutoObservable } from 'mobx';
import { login, register, refreshToken, ApiResponse } from '@api/auth';
import { LoginRequest, LoginResponse, RegisterRequest, TokenData } from '@src/types';
import { decodeToken } from '@utils/jwtDecode';

class AuthStore {
    accessToken: string | null = localStorage.getItem('access_token');
    refreshToken: string | null = localStorage.getItem('refresh_token');
    isAuthenticated: boolean = !!this.accessToken;
    user: TokenData | null = this.accessToken ? decodeToken(this.accessToken) : null;
    errors: Record<string, string[]> = {};

    constructor() {
        makeAutoObservable(this);
    }

    async login(data: LoginRequest) {
        this.clearErrors();
        const result: ApiResponse<LoginResponse> = await login(data);

        if (result.success && result.data) {
            this.accessToken = result.data.access;
            this.refreshToken = result.data.refresh;
            localStorage.setItem('access_token', result.data.access);
            localStorage.setItem('refresh_token', result.data.refresh);
            this.isAuthenticated = true;
            this.user = decodeToken(result.data.access);
        } else if (result.errors) {
            this.errors = result.errors;
        }
    }

    async register(data: RegisterRequest) {
        this.clearErrors();
        const result: ApiResponse<void> = await register(data);

        if (result.success) {
            await this.login({ username: data.username, password: data.password });
        } else if (result.errors) {
            this.errors = result.errors;
        }
    }

    async refreshAccessToken() {
        if (this.refreshToken) {
            const result: ApiResponse<string> = await refreshToken(this.refreshToken);

            if (result.success && result.data) {
                this.accessToken = result.data;
                localStorage.setItem('access_token', result.data);
                this.user = decodeToken(result.data); // Обновляем данные пользователя
            } else {
                this.logout();
            }
        }
    }

    logout() {
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.isAuthenticated = false;
    }

    addErrors(errors: Record<string, string[]>, clearPreviousErrors = false) {
        if (clearPreviousErrors) {
            this.errors = errors;
            return;
        }

        for (const key in errors) {
            if (Object.prototype.hasOwnProperty.call(errors, key)) {
                if (this.errors[key]) {
                    // Если ошибка для этого ключа уже существует, объединяем массивы
                    this.errors[key] = [...this.errors[key], ...errors[key]];
                } else {
                    // Иначе просто добавляем новый ключ с ошибками
                    this.errors[key] = errors[key];
                }
            }
        }
    }

    clearErrors() {
        this.errors = {};
    }

    hasErrors(): boolean {
        return this.errors && Object.keys(this.errors).length > 0;
    }

    getErrorMessages(): string {
        return Object.values(this.errors)
            .map((errorMessages) => errorMessages.join('\n'))
            .join('\n\n');
    }
}

const authStore = new AuthStore();
export default authStore;
