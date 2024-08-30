import React, { useRef } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Box,
    Typography,
} from '@mui/material';
import { Category, CategoryFormData } from '@admin/api/category';

interface CategoryFormDialogProps {
    open: boolean;
    categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'image'> & { image: File | null };
    categories: Category[];
    editingCategory: Category | null;
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

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <DialogTitle>{editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin='dense'
                    label='Название'
                    type='text'
                    fullWidth
                    value={categoryData.name}
                    onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                />
                <FormControl fullWidth margin='dense'>
                    <InputLabel id='parent-category-label'>Родительская категория</InputLabel>
                    <Select
                        labelId='parent-category-label'
                        value={categoryData.parent?.id || ''}
                        label='Родительская категория'
                        onChange={(e) =>
                            setCategoryData({
                                ...categoryData,
                                parent: categories.find((cat) => cat.id === e.target.value) || null,
                            })
                        }
                    >
                        <MenuItem value=''>
                            <em>Нет</em>
                        </MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant='contained' component='label' sx={{ mt: 2 }}>
                    Загрузить изображение
                    <input
                        type='file'
                        hidden
                        accept='image/*'
                        onChange={(e) => onImageChange(e.target.files ? e.target.files[0] : null)}
                        ref={inputFileRef}
                    />
                </Button>
                {categoryData.image && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant='body2'>{categoryData.image.name}</Typography>
                        <img src={URL.createObjectURL(categoryData.image)} alt='Preview' style={{ maxHeight: '150px', marginTop: '10px' }} />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='error'>
                    Отмена
                </Button>
                <Button onClick={handleSave} color='primary'>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryFormDialog;
