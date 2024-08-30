import React, { useEffect, useRef, useState } from 'react';
import { Button, MenuItem, Select, InputLabel, FormControl, Box, Typography } from '@mui/material';
import { CategoryFormData } from '@admin/api/category';
import DataFormDialog from '@admin/components/dataFormDialog/DataFormDialog';
import { ICategory } from '@admin/types/category';

interface CategoryFormDialogProps {
    open: boolean;
    categoryData: Omit<ICategory, 'id' | 'created_at' | 'updated_at' | 'image'> & { image: File | null };
    categories: ICategory[] | undefined;
    editingCategory: ICategory | null;
    onClose: () => void;
    onSave: () => void;
    setCategoryData: React.Dispatch<React.SetStateAction<CategoryFormData>>;
    onImageChange: (file: File | null) => void;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
    open,
    categoryData,
    categories,
    editingCategory,
    onClose,
    onSave,
    setCategoryData,
    onImageChange,
}) => {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(editingCategory ? editingCategory.image : null);

    useEffect(() => {
        setPreview(editingCategory ? editingCategory.image : null);
    }, [editingCategory]);

    const handleSave = () => {
        if (!categoryData.name.trim()) {
            alert('Пожалуйста, введите название категории.');
            return;
        }
        if (categoryData.parent && categoryData.parent.id === editingCategory?.id) {
            alert('Категория не может быть родительской самой себе.');
            return;
        }
        onSave();
    };

    const handleClose = () => {
        onClose();
        if (inputFileRef.current) {
            inputFileRef.current.value = ''; // Очистка поля выбора файла
        }
    };

    const handleChangeImage = (file: File | null) => {
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setPreview(fileURL);
        }

        onImageChange(file);
    };

    return (
        <DataFormDialog<CategoryFormData>
            open={open}
            title={editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}
            data={categoryData}
            onClose={handleClose}
            onSave={handleSave}
            onChange={(key, value) => setCategoryData((prev) => ({ ...prev, [key]: value }))}
            fields={[{ key: 'name', label: 'Название' }]}
            additionalContent={
                <>
                    <FormControl fullWidth margin='dense'>
                        <InputLabel id='parent-category-label'>Родительская категория</InputLabel>
                        <Select
                            labelId='parent-category-label'
                            value={categoryData.parent?.id || ''}
                            label='Родительская категория'
                            onChange={(e) =>
                                setCategoryData({
                                    ...categoryData,
                                    parent: categories?.find((cat) => cat.id === e.target.value) || null,
                                })
                            }
                        >
                            <MenuItem value=''>
                                <em>Нет</em>
                            </MenuItem>
                            {categories?.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ mt: 2 }}>
                        {preview && (
                            <Box
                                component='img'
                                src={preview || ''}
                                alt='preview'
                                sx={{ width: '100%', maxWidth: '300px', height: 'auto', borderRadius: 1 }}
                            />
                        )}
                        {categoryData.image && <Typography variant='body2'>{categoryData.image.name}</Typography>}
                    </Box>

                    <Button variant='text' size={'large'} component='label'>
                        {preview ? 'Изменить изображение' : 'Загрузить изображение'}
                        <input type='file' hidden accept='image/*' onChange={(e) => handleChangeImage(e.target.files ? e.target.files[0] : null)} />
                    </Button>
                </>
            }
        />
    );
};

export default CategoryFormDialog;
