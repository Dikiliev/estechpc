// src/api/products.ts

import apiInstance from '@api/axios';
import { IProduct, IProductDetail, IReview } from 'types/products';
import { createAuthAxiosInstance } from '@api/authAxios';
import { Filter } from 'types/productFilters';

interface ProductsResponse {
    results: IProduct[];
    next: string | null;
}

export interface FiltersResponse {
    filters: Filter[];
}

const authAxios = createAuthAxiosInstance();

export const fetchProducts = async (
    categoryId: number | null,
    selectedFilters: { [key: string]: string[] },
    priceRange: { min: number; max: number },
    page: number
): Promise<ProductsResponse> => {
    try {
        const params = new URLSearchParams();

        if (categoryId !== null) {
            params.append('c', categoryId.toString());
        }
        if (priceRange.min > 0) {
            params.append('minp', priceRange.min.toString());
        }
        if (priceRange.max > 0) {
            params.append('maxp', priceRange.max.toString());
        }

        // Adding attribute filters
        Object.entries(selectedFilters).forEach(([key, values]) => {
            values.forEach((value) => {
                params.append('attribute', `${key}:${value}`);
            });
        });

        params.append('include_out_of_stock', 'false');
        params.append('page', page.toString());

        const response = await authAxios.get(`/products/list/?${params.toString()}`);
        if (response.data && Array.isArray(response.data.results)) {
            return response.data;
        }
        throw new Error('Invalid data format: results should be an array');
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
};

export const fetchAllProducts = async (page: number): Promise<ProductsResponse> => {
    try {
        const response = await authAxios.get(`/products/list/?page=${page}`);
        if (response.data && Array.isArray(response.data.results)) {
            return response.data;
        }
        throw new Error('Invalid data format: results should be an array');
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw new Error('Failed to fetch all products');
    }
};

export const fetchProductById = async (productId: string): Promise<IProductDetail> => {
    try {
        const response = await authAxios.get(`/products/list/${productId}/?include_detail=True`);
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки продукта:', error);
        throw new Error('Failed to fetch product');
    }
};

export const fetchProductReviews = async (productId: string): Promise<IReview[]> => {
    const response = await authAxios.get(`/community/products/${productId}/reviews/`);
    return response.data;
};

export const fetchFilters = async (categoryId: number): Promise<FiltersResponse> => {
    const response = await apiInstance.get(`/products/categories/${categoryId}/filters/`);
    if (response.data) {
        return response.data;
    }
    throw new Error('Invalid data format for filters');
};
