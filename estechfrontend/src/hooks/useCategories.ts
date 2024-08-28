import { useQuery } from '@tanstack/react-query';
import apiInstance from '@api/axios';
import { Category, ParentCategory } from 'types/category';

export const useCategories = (parentId: number | null) => {
    return useQuery({
        queryKey: ['categories', parentId],
        queryFn: async () => {
            const response = await apiInstance.get<Category[]>(`/products/categories/?parent_id=${parentId !== null ? parentId : 0}`);
            return response.data;
        },
    });
};

export const useCategoryPath = (categoryId: number | null) => {
    return useQuery({
        queryKey: ['categoryPath', categoryId],
        queryFn: async () => {
            if (categoryId !== null) {
                const response = await apiInstance.get<ParentCategory[]>(`/products/categories/${categoryId}/parents/?include_yourself=true`);
                return response.data;
            }
            return [];
        },
        enabled: categoryId !== null,
    });
};

export const fetchChildrenCategories = async (categoryId: number) => {
    const response = await apiInstance.get(`/products/categories/${categoryId}/children/`);
    return response.data;
};
