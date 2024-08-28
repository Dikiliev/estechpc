import React from 'react';
import { Typography, List, FormGroup, FormControlLabel, Checkbox, TextField, Box, Button } from '@mui/material';
import { Filter, Filters, Range } from 'types/productFilters';

interface FiltersPanelProps {
    filters: Filter[] | undefined;
    selectedFilters: Filters;
    priceRange: Range;
    onFilterChange: (filters: Filters) => void;
    onPriceRangeChange: (range: Range) => void;
    onApply: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, selectedFilters, priceRange, onFilterChange, onPriceRangeChange, onApply }) => {
    const [enabledApplyButton, setEnabledApplyButton] = React.useState(false);

    const handleFilterChange = (filterId: string, value: string) => {
        onFilterChange({
            ...selectedFilters,
            [filterId]: selectedFilters[filterId]?.includes(value)
                ? selectedFilters[filterId].filter((v) => v !== value)
                : [...(selectedFilters[filterId] || []), value],
        });
        setEnabledApplyButton(true);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onPriceRangeChange({
            ...priceRange,
            [name]: parseFloat(value) || 0,
        });
        setEnabledApplyButton(true);
    };

    const handleApply = () => {
        setEnabledApplyButton(false);
        onApply();
    };

    return (
        <Box>
            <Typography variant='h6'>Фильтры</Typography>
            <List subheader={'Цена'}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormGroup sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                label='Минимум'
                                type='number'
                                name='min'
                                value={priceRange.min}
                                onChange={handlePriceChange}
                                size='small'
                                variant='outlined'
                                fullWidth
                            />
                            <TextField
                                label='Максимум'
                                type='number'
                                name='max'
                                value={priceRange.max}
                                onChange={handlePriceChange}
                                size='small'
                                variant='outlined'
                                fullWidth
                            />
                        </Box>
                    </FormGroup>
                    {filters?.map((filter) => (
                        <FormGroup key={filter.id}>
                            <Typography variant='subtitle1'>{filter.name}</Typography>
                            {filter.values.map((value) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedFilters[filter.id]?.includes(value) || false}
                                            onChange={() => handleFilterChange(filter.id.toString(), value)}
                                        />
                                    }
                                    label={value}
                                    key={value}
                                />
                            ))}
                        </FormGroup>
                    ))}
                </Box>
            </List>

            <Button disabled={!enabledApplyButton} variant='contained' onClick={handleApply} sx={{ mt: 2 }}>
                Применить
            </Button>
        </Box>
    );
};

export default FiltersPanel;
