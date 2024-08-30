import { useQuery, useMutation, useQueryClient, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { createAuthAxiosInstance } from '@api/authAxios';

const authAxios = createAuthAxiosInstance();

export interface Category {
    id: number;
    name: string;
    parent: Category | null;
    image: string | null;
    created_at: string;
    updated_at: string;
}

export interface CategoryFormData {
    name: string;
    parent: Category | null;
    image: File | null; // Здесь тип File, так как это состояние на стороне клиента
}

// Получение списка категорий
const getCategories = async (): Promise<Category[]> => {
    const response = await authAxios.get<Category[]>('products/categories/');
    return response.data;
};

// Создание новой категории
const createCategory = async (category: FormData): Promise<Category> => {
    const response = await authAxios.post<Category>('products/categories/', category, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Обновление существующей категории
const updateCategory = async ({ id, category }: { id: number; category: FormData }): Promise<Category> => {
    const response = await authAxios.put<Category>(`products/categories/${id}/`, category, {
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
export const useCategories = (): UseQueryResult<Category[], Error> => {
    return useQuery<Category[], Error>({
        queryKey: ['categories'],
        queryFn: getCategories,
    });
};

// Хук для создания новой категории
export const useCreateCategory = (): UseMutationResult<Category, Error, FormData> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

// Хук для обновления существующей категории
export const useUpdateCategory = (): UseMutationResult<Category, Error, { id: number; category: FormData }> => {
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
