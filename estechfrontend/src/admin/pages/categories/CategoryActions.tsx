import React from 'react';
import { Button } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ICategory } from '@admin/types/category';

interface CategoryActionsProps {
    category: ICategory;
    onEdit: (category: ICategory) => void;
    onDelete: (id: number) => void;
}

const CategoryActions: React.FC<CategoryActionsProps> = ({ category, onEdit, onDelete }) => {
    return (
        <>
            <Button variant='outlined' color='primary' startIcon={<EditIcon />} sx={{ mr: 1 }} onClick={() => onEdit(category)}>
                Редактировать
            </Button>
            <Button variant='outlined' color='error' startIcon={<DeleteIcon />} onClick={() => onDelete(category.id)}>
                Удалить
            </Button>
        </>
    );
};

export default CategoryActions;
