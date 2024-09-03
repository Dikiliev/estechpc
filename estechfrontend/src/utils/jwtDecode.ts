// src/utils/jwtDecode.ts
import {jwtDecode} from 'jwt-decode';
import {TokenData} from '../types';

export const decodeToken = (token: string): TokenData | null => {
    try {
        return jwtDecode<TokenData>(token);
    } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        return null;
    }
};
