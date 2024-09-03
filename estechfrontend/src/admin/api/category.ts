import { useQuery, useMutation, useQueryClient, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { ICategory } from '@admin/types/category';
import { apiInstance } from '@src/api';

export interface CategoryFormData {
    name: string;
    parent: ICategory | null;
    image: File | null; // Здесь тип File, так как это состояние на стороне клиента
}

// Получение списка категорий
const getCategories = async (): Promise<ICategory[]> => {
    const response = await apiInstance.get<ICategory[]>('products/categories/');
    return response.data;
};

// Создание новой категории
const createCategory = async (category: FormData): Promise<ICategory> => {
    const response = await apiInstance.post<ICategory>('products/categories/', category, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Обновление существующей категории
const updateCategory = async ({ id, category }: { id: number; category: FormData }): Promise<ICategory> => {
    const response = await apiInstance.put<ICategory>(`products/categories/${id}/`, category, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Удаление категории
const deleteCategory = async (id: number): Promise<void> => {
    await apiInstance.delete(`products/categories/${id}/`);
};

// Хук для получения категорий
export const useCategories = (): UseQueryResult<ICategory[], Error> => {
    return useQuery<ICategory[], Error>({
        queryKey: ['categories'],
        queryFn: getCategories,
    });
};

// Хук для создания новой категории
export const useCreateCategory = (): UseMutationResult<ICategory, Error, FormData> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

// Хук для обновления существующей категории
export const useUpdateCategory = (): UseMutationResult<ICategory, Error, { id: number; category: FormData }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

// Хук для удаления категории
export const useDeleteCategory = (): UseMutationResult<void, Error, number> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};
