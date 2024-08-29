import React from 'react';
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
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
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
                <TextField
                    margin='dense'
                    label='Описание'
                    type='text'
                    fullWidth
                    value={categoryData.description}
                    onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
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
                    <input type='file' hidden accept='image/*' onChange={(e) => onImageChange(e.target.files ? e.target.files[0] : null)} />
                </Button>
                {categoryData.image && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant='body2'>{categoryData.image.name}</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='secondary'>
                    Отмена
                </Button>
                <Button onClick={onSave} color='primary'>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryFormDialog;
