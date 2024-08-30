import React, { useRef } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import { Category } from '@admin/api/category';
import CategoryActions from './CategoryActions';

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
    onImageChange: (category: Category, file: File) => void; // Новый пропс для изменения изображения
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete, onImageChange }) => {
    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    const handleImageClick = (categoryId: number) => {
        if (fileInputRefs.current[categoryId]) {
            fileInputRefs.current[categoryId]!.click(); // Открытие диалога выбора файла
        }
    };

    const handleFileChange = (category: Category, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageChange(category, file);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Изображение</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Родительская категория</TableCell>
                        <TableCell align='right'>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell>
                                <input
                                    type='file'
                                    style={{ display: 'none' }}
                                    ref={(el) => (fileInputRefs.current[category.id] = el)}
                                    accept='image/*'
                                    onChange={(event) => handleFileChange(category, event)}
                                />
                                <Avatar
                                    alt={category.name}
                                    src={category.image || undefined}
                                    variant='rounded'
                                    sx={{ width: 56, height: 56, cursor: 'pointer' }}
                                    onClick={() => handleImageClick(category.id)}
                                >
                                    {!category.image && 'N/A'}
                                </Avatar>
                            </TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.parent?.name || 'Нет'}</TableCell>
                            <TableCell align='right'>
                                <CategoryActions category={category} onEdit={onEdit} onDelete={onDelete} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CategoryTable;
