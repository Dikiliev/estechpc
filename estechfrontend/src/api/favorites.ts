import apiInstance from '@api/apiInstance';
import { IFavoritesList } from 'types/favorites';
import { AxiosResponse } from 'axios';

export const fetchFavorites = async (): Promise<IFavoritesList> => {
    const response: AxiosResponse<IFavoritesList> = await apiInstance.get('/orders/favorites/');
    console.log(response.data);
    return response.data;
};

export const addToFavorites = async (productId: number) => {
    const response = await apiInstance.post('/orders/favorites/add/', {
        product_id: productId,
    });
    return response.data;
};

export const removeFromFavorites = async (productId: number) => {
    const response = await apiInstance.delete(`/orders/favorites/remove/${productId}/`);
    return response.data;
};
