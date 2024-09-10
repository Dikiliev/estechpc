// src/api/orders.ts
import { IOrder, IOrderCreateData } from 'types/order';
import apiInstance from '@api/apiInstance';
import { PaginatedResponse } from 'types/common';

// Получение списка заказов с поддержкой пагинации
export const fetchOrders = async (page: number = 1): Promise<PaginatedResponse<IOrder>> => {
    const response = await apiInstance.get(`/orders/list/?page=${page}`);
    return response.data;
};

// Создание нового заказа
export const createOrder = async (orderData: IOrderCreateData): Promise<IOrderCreateData> => {
    const response = await apiInstance.post('/orders/list/', orderData);
    return response.data;
};
