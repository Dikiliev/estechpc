// src/api/products.ts

import apiInstance from '@api/axios';
import { FiltersResponse } from '@components/filtersPanel/FiltersPanel';
import { Products, IProductDetail } from 'types/products';

// Интерфейс для ответа API
interface ProductsResponse {
    results: Products[];
    next: string | null;
}

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

        const response = await apiInstance.get(`/products/list/?${params.toString()}`);
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
        const response = await apiInstance.get(`/products/list/?page=${page}`);
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
    const response = await apiInstance.get(`/products/list/${productId}/?include_detail=True`);
    if (response.data) {
        return response.data;
    }
    throw new Error('Product not found');
};

export const fetchFilters = async (categoryId: number): Promise<FiltersResponse> => {
    const response = await apiInstance.get(`/products/categories/${categoryId}/filters/`);
    if (response.data) {
        return response.data;
    }
    throw new Error('Invalid data format for filters');
};
