import apiInstance from '@api/axios';
import { Category, ParentCategory, ChildCategory } from 'types/category';

// Получение списка категорий с опциональными параметрами
export const fetchCategories = async (parentId?: number | null, hasProducts?: boolean): Promise<Category[]> => {
    const params = new URLSearchParams();

    if (parentId !== undefined) {
        params.append('parent_id', parentId !== null ? parentId.toString() : '0');
    }

    if (hasProducts) {
        params.append('has_products', 'true');
    }

    const response = await apiInstance.get<Category[]>(`/products/categories/?${params.toString()}`);
    return response.data;
};

// Получение дочерних категорий
export const fetchChildrenCategories = async (categoryId: number): Promise<ChildCategory[]> => {
    const response = await apiInstance.get<ChildCategory[]>(`/products/categories/${categoryId}/children/`);
    return response.data;
};

// Получение пути до текущей категории (
export const fetchCategoryPath = async (categoryId: number): Promise<ParentCategory[]> => {
    const response = await apiInstance.get<ParentCategory[]>(`/products/categories/${categoryId}/parents/?include_yourself=true`);
    return response.data;
};
