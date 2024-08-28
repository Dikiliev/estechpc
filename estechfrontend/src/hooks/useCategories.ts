import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchCategoryPath } from '@api/category';
import { Category, ParentCategory } from 'types/category';

export const useCategories = (parentId: number | null) => {
    return useQuery<Category[]>({
        queryKey: ['categories', parentId],
        queryFn: () => fetchCategories(parentId),
    });
};

export const useCategoryPath = (categoryId: number | null) => {
    return useQuery<ParentCategory[]>({
        queryKey: ['categoryPath', categoryId],
        queryFn: () => {
            if (categoryId !== null) {
                return fetchCategoryPath(categoryId);
            }
            return Promise.resolve([]);
        },
        enabled: categoryId !== null,
    });
};
