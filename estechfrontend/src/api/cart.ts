import { AxiosResponse } from 'axios';
import { ICart } from 'types/cart';
import apiInstance from '@api/apiInstance';

// Получение данных корзины
export const fetchCart = async (): Promise<ICart> => {
    const response: AxiosResponse<ICart> = await apiInstance.get('/orders/cart/');
    return response.data;
};

// Добавление товара в корзину
export const addProductToCart = async (productId: number, quantity: number = 1): Promise<void> => {
    await apiInstance.post('/orders/cart/add/', { product_id: productId, quantity });
};

// Обновление количества товара в корзине
export const updateCartItem = async (itemId: number, quantity: number): Promise<void> => {
    await apiInstance.patch(`/orders/cart/update/${itemId}/`, { quantity });
};

// Удаление товара из корзины
export const removeProductFromCart = async (itemId: number): Promise<void> => {
    await apiInstance.delete(`/orders/cart/remove/${itemId}/`);
};

// Очистка корзины
export const clearCart = async (): Promise<void> => {
    await apiInstance.post('/orders/cart/clear/');
};
