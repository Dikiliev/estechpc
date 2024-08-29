import React, { useState } from 'react';
import { Button, Typography, CircularProgress, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, Category, CategoryFormData } from '@admin/api/category';
import CategoryTable from './CategoryTable';
import CategoryFormDialog from './CategoryFormDialog';

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
        description: '',
        image: null,
    });

    const handleOpen = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setCategoryData({
                name: category.name,
                parent: category.parent,
                description: category.description,
                image: null, // Изображение загружается заново
            });
        } else {
            setEditingCategory(null);
            setCategoryData({
                name: '',
                parent: null,
                description: '',
                image: null,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleImageChange = (file: File | null) => {
        setCategoryData((prev) => ({
            ...prev,
            image: file,
        }));
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', categoryData.name);
        formData.append('description', categoryData.description);
        if (categoryData.parent) formData.append('parent', String(categoryData.parent.id));
        if (categoryData.image) formData.append('image', categoryData.image);

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

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Typography variant='h6' color='error'>
                Ошибка загрузки категорий
            </Typography>
        );
    }

    return (
        <div>
            <Typography variant='h4' gutterBottom>
                Управление категориями
            </Typography>
            <Button variant='contained' color='primary' startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={() => handleOpen()}>
                Добавить категорию
            </Button>
            <CategoryTable categories={categories || []} onEdit={handleOpen} onDelete={handleDelete} />
            <CategoryFormDialog
                open={open}
                categories={categories || []}
                categoryData={categoryData}
                editingCategory={editingCategory}
                onClose={handleClose}
                onSave={handleSave}
                setCategoryData={setCategoryData}
                onImageChange={handleImageChange}
            />
        </div>
    );
};

export default CategoriesPage;
