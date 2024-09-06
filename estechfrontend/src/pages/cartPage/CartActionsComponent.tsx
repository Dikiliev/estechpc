import React from 'react';
import { Button, CircularProgress, Box, Checkbox, FormControlLabel } from '@mui/material';

interface CartActionsProps {
    isRemovingSelected: boolean;
    onRemoveSelectedItems: () => void;

    onToggleSelectAll: () => void;
    areAllItemsSelected: boolean;
}

const CartActionsComponent: React.FC<CartActionsProps> = ({ isRemovingSelected, onRemoveSelectedItems, onToggleSelectAll, areAllItemsSelected }) => {
    return (
        <Box display='flex' justifyContent='start' alignItems='center'>
            <FormControlLabel
                control={<Checkbox checked={areAllItemsSelected} onChange={onToggleSelectAll} color='primary' />}
                label={areAllItemsSelected ? 'Отменить выбор всех' : 'Выбрать все'}
            />

            <Button variant='text' color='error' size='large' onClick={onRemoveSelectedItems} disabled={isRemovingSelected}>
                {isRemovingSelected ? <CircularProgress size={24} /> : 'Удалить выбранные товары'}
            </Button>
        </Box>
    );
};

export default CartActionsComponent;
