import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchCategories, fetchCategoryPath } from '@api/category';
import { Category, ParentCategory } from 'types/category';

/**
 * useCategories - Хук для получения категорий.
 *
 * @param {number | null} parentId - ID родительской категории. Если null, возвращаются только категории верхнего уровня.
 * @param {boolean} hasProducts - Если true, возвращаются только категории с продуктами.
 *
 * @returns {UseQueryResult<Category[]>} - Данные категорий и состояния запроса.
 */
export const useCategories = ({
    parentId = undefined,
    hasProducts = false,
}: {
    parentId?: number | null;
    hasProducts?: boolean;
} = {}): UseQueryResult<Category[]> => {
    const queryKey = ['categories', { parentId, hasProducts }];

    return useQuery<Category[]>({
        queryKey,
        queryFn: () => fetchCategories(parentId, hasProducts),
        staleTime: 1000 * 60 * 30,
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
