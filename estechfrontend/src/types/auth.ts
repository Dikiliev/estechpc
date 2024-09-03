// src/types/auth.ts
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface RegisterRequest {
    username: string;
    email: string;

    password: string;
    password2: string;
}

export interface TokenData {
    exp: number;
    user_id: string;
    username: string;
}
