import React from 'react';
import { Avatar } from '@mui/material';
import CategoryActions from './CategoryActions';
import DataTable from '@admin/components/dataTable/DataTable';
import { ICategory } from '@admin/types/category';

interface CategoryTableProps {
    categories: ICategory[];
    onEdit: (category: ICategory) => void;
    onDelete: (id: number) => void;
    onImageChange: (file: File | null, category?: ICategory) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete, onImageChange }) => {
    return (
        <DataTable<ICategory>
            data={categories}
            columns={[
                {
                    label: 'Изображение',
                    accessor: (category) => (
                        <Avatar
                            alt={category.name}
                            src={category.image || undefined}
                            variant='rounded'
                            sx={{ width: 70, height: 60, cursor: 'pointer' }}
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
