import { useQuery, useMutation, useQueryClient, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { createAuthAxiosInstance } from '@api/authAxios';
import { ICategory } from '@admin/types/category';

const authAxios = createAuthAxiosInstance();

export interface CategoryFormData {
    name: string;
    parent: ICategory | null;
    image: File | null; // Здесь тип File, так как это состояние на стороне клиента
}

// Получение списка категорий
const getCategories = async (): Promise<ICategory[]> => {
    const response = await authAxios.get<ICategory[]>('products/categories/');
    return response.data;
};

// Создание новой категории
const createCategory = async (category: FormData): Promise<ICategory> => {
    const response = await authAxios.post<ICategory>('products/categories/', category, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Обновление существующей категории
const updateCategory = async ({ id, category }: { id: number; category: FormData }): Promise<ICategory> => {
    const response = await authAxios.put<ICategory>(`products/categories/${id}/`, category, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Удаление категории
const deleteCategory = async (id: number): Promise<void> => {
    await authAxios.delete(`products/categories/${id}/`);
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
