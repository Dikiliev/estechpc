import React, { useState, useMemo } from 'react';
import { Button, Typography, Container } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, Category, CategoryFormData } from '@admin/api/category';

import { filterData, sortData } from '@admin/utils/dataFilters';
import DataFilters from '@admin/components/dataFilters/DataFilters';
import CategoryTable from '@admin/pages/categories/CategoryTable';
import CategoryFormDialog from '@admin/pages/categories/CategoryFormDialog';
import LoadingBox from '@components/loadingBox/LoadingBox';
import ErrorText from '@components/errorText/ErrorText';

const CategoriesPage: React.FC = () => {
    const { data: categories, isLoading, isError } = useCategories();
    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();
    const deleteCategoryMutation = useDeleteCategory();

    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryData, setCategoryData] = useState<CategoryFormData>({
        name: '',
        parent: null,
        image: null,
    });

    const [filterBy, setFilterBy] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleOpen = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setCategoryData({
                name: category.name,
                parent: category.parent,
                image: null,
            });
        } else {
            setEditingCategory(null);
            setCategoryData({
                name: '',
                parent: null,
                image: null,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleImageChange = (file: File | null, category?: Category) => {
        if (category) {
            const formData = new FormData();
            formData.append('name', category.name);
            if (category.parent) formData.append('parent', String(category.parent.id));
            formData.append('image', file!);

            updateCategoryMutation.mutate({ id: category.id, category: formData });
        } else {
            setCategoryData((prev) => ({
                ...prev,
                image: file,
            }));
        }
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', categoryData.name);

        if (categoryData.parent) {
            formData.append('parent_id', String(categoryData.parent.id));
        } else {
            formData.append('parent_id', '');
        }

        if (categoryData.image) {
            formData.append('image', categoryData.image);
        }

        if (editingCategory) {
            updateCategoryMutation.mutate({ id: editingCategory.id, category: formData });
        } else {
            createCategoryMutation.mutate(formData);
        }

        handleClose();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
            deleteCategoryMutation.mutate(id);
        }
    };

    const filteredCategories = useMemo(() => {
        const filtered = filterData(categories || [], filterBy, (category) => {
            if (filterBy === 'noImage') return !category.image;
            if (filterBy === 'incomplete') return !category.name || !category.image;
            return true;
        });

        return sortData(filtered, sortOrder, (category) => category.name);
    }, [categories, filterBy, sortOrder]);

    if (isLoading) {
        return <LoadingBox />;
    }

    if (isError) {
        return <ErrorText>Ошибка загрузки категорий</ErrorText>;
    }

    return (
        <Container maxWidth='xl'>
            <Typography variant='h4' gutterBottom>
                Управление категориями
            </Typography>
            <Button variant='contained' color='primary' startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={() => handleOpen()}>
                Добавить категорию
            </Button>
            <DataFilters
                filterBy={filterBy}
                sortOrder={sortOrder}
                onFilterChange={setFilterBy}
                onSortOrderChange={setSortOrder}
                filters={[
                    { label: 'Все категории', value: 'all' },
                    { label: 'Без изображения', value: 'noImage' },
                    { label: 'Неполные данные', value: 'incomplete' },
                ]}
            />
            <CategoryTable categories={filteredCategories} onEdit={handleOpen} onDelete={handleDelete} onImageChange={handleImageChange} />

            <CategoryFormDialog
                open={open}
                categoryData={categoryData}
                categories={categories}
                editingCategory={editingCategory}
                onClose={handleClose}
                onSave={handleSave}
                setCategoryData={setCategoryData}
                onImageChange={handleImageChange}
            />
        </Container>
    );
};

export default CategoriesPage;
