import apiInstance from '@api/apiInstance';
import { IFavorite } from 'types/favorites';

export const fetchFavorites = async (): Promise<IFavorite[]> => {
    const response = await apiInstance.get('/products/favorites/');
    return response.data;
};

export const addToFavorites = async (productId: number) => {
    const response = await apiInstance.post('/products/favorites/', {
        product_id: productId,
    });
    return response.data;
};

export const removeFromFavorites = async (productId: number) => {
    const response = await apiInstance.delete(`/products/favorites/${productId}/`);
    return response.data;
};
