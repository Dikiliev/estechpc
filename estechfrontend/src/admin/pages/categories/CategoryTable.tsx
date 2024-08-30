import React from 'react';
import { Avatar } from '@mui/material';
import { Category } from '@admin/api/category';
import CategoryActions from './CategoryActions';
import DataTable from '@admin/components/dataTable/DataTable';

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
    onImageChange: (file: File | null, category?: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete, onImageChange }) => {
    return (
        <DataTable<Category>
            data={categories}
            columns={[
                {
                    label: 'Изображение',
                    accessor: (category) => (
                        <Avatar
                            alt={category.name}
                            src={category.image || undefined}
                            variant='square'
                            sx={{ width: 56, height: 56, cursor: 'pointer' }}
                            onClick={() => {
                                const fileInput = document.createElement('input');
                                fileInput.type = 'file';
                                fileInput.accept = 'image/*';
                                fileInput.onchange = (e: Event) => {
                                    const target = e.target as HTMLInputElement;
                                    onImageChange(target.files ? target.files[0] : null, category);
                                };
                                fileInput.click();
                            }}
                        >
                            {!category.image && 'N/A'}
                        </Avatar>
                    ),
                },
                { label: 'Название', accessor: 'name' },
                { label: 'Родительская категория', accessor: (category) => category.parent?.name || 'Нет' },
            ]}
            renderActions={(category) => <CategoryActions category={category} onEdit={onEdit} onDelete={() => onDelete(category.id)} />}
        />
    );
};

export default CategoryTable;
