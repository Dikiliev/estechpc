import React, { useState, useMemo } from 'react';
import { Button, Typography, CircularProgress, Box, Container, TextField, MenuItem } from '@mui/material';
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

    const handleImageChange = (category: Category, file: File) => {
        const formData = new FormData();
        formData.append('name', category.name);
        if (category.parent) formData.append('parent', String(category.parent.id));
        formData.append('image', file);

        updateCategoryMutation.mutate({ id: category.id, category: formData });
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', categoryData.name);
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

    // Фильтрация и сортировка категорий
    const filteredCategories = useMemo(() => {
        let filtered = categories || [];

        if (filterBy === 'noImage') {
            filtered = filtered.filter((category) => !category.image);
        } else if (filterBy === 'incomplete') {
            filtered = filtered.filter((category) => !category.name || !category.image);
        }

        return filtered.sort((a, b) => {
            const compare = a.name.localeCompare(b.name);
            return sortOrder === 'asc' ? compare : -compare;
        });
    }, [categories, filterBy, sortOrder]);

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
        <Container maxWidth={'xl'}>
            <Typography variant='h4' gutterBottom>
                Управление категориями
            </Typography>
            <Button variant='contained' color='primary' startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={() => handleOpen()}>
                Добавить категорию
            </Button>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField select label='Фильтр' value={filterBy} onChange={(e) => setFilterBy(e.target.value)} sx={{ minWidth: 200 }}>
                    <MenuItem value='all'>Все категории</MenuItem>
                    <MenuItem value='noImage'>Без изображения</MenuItem>
                    <MenuItem value='incomplete'>Неполные данные</MenuItem>
                </TextField>

                <TextField
                    select
                    label='Сортировка'
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value='asc'>По алфавиту (А-Я)</MenuItem>
                    <MenuItem value='desc'>По алфавиту (Я-А)</MenuItem>
                </TextField>
            </Box>
            <CategoryTable categories={filteredCategories} onEdit={handleOpen} onDelete={handleDelete} onImageChange={handleImageChange} />
            <CategoryFormDialog
                open={open}
                categories={categories || []}
                categoryData={categoryData}
                editingCategory={editingCategory}
                onClose={handleClose}
                onSave={handleSave}
                setCategoryData={setCategoryData}
                onImageChange={(file) => setCategoryData((prev) => ({ ...prev, image: file }))}
            />
        </Container>
    );
};

export default CategoriesPage;
