import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';

interface DataFiltersProps {
    filterBy: string;
    sortOrder: 'asc' | 'desc';
    onFilterChange: (value: string) => void;
    onSortOrderChange: (value: 'asc' | 'desc') => void;
    filters?: { label: string; value: string }[];
}

const DataFilters: React.FC<DataFiltersProps> = ({ filterBy, sortOrder, onFilterChange, onSortOrderChange, filters = [] }) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField select label='Фильтр' value={filterBy} onChange={(e) => onFilterChange(e.target.value)} sx={{ minWidth: 200 }}>
                {filters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                        {filter.label}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                label='Сортировка'
                value={sortOrder}
                onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
                sx={{ minWidth: 200 }}
            >
                <MenuItem value='asc'>По алфавиту (А-Я)</MenuItem>
                <MenuItem value='desc'>По алфавиту (Я-А)</MenuItem>
            </TextField>
        </Box>
    );
};

export default DataFilters;
