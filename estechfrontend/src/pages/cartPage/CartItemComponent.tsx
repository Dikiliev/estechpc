import React from 'react';
import { Box, Typography, IconButton, Divider, Checkbox } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { DEFAULT_PRODUCT_IMAGE } from '@utils/constans';
import theme from '@styles/theme';
import { ICartItem as CartItemType } from 'types/cart';

interface CartItemProps {
    item: CartItemType;
    selected: boolean;
    onSelect: () => void;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, selected, onSelect, onIncrease, onDecrease, onRemove }) => {
    return (
        <>
            <Divider sx={{ my: 2 }} />
            <Box
                display='flex'
                flexDirection={{ xs: 'column', sm: 'row' }} // Колонка на малых экранах, ряд на больших
                alignItems={{ xs: 'flex-start', sm: 'center' }} // Выравнивание по началу на малых экранах, по центру на больших
                sx={{ mb: 3 }}
            >
                <Box display='flex' alignItems='center' mb={{ xs: 2, sm: 0 }}>
                    <Checkbox checked={selected} onChange={onSelect} color='primary' />
                    <Box
                        component='img'
                        src={item.product.photos[0]?.photo || DEFAULT_PRODUCT_IMAGE}
                        alt={item.product.name}
                        sx={{
                            width: { xs: 80, sm: 100 },
                            height: { xs: 80, sm: 100 },
                            objectFit: 'cover',
                            borderRadius: 2,
                            mr: 3,
                        }}
                    />
                </Box>
                <Box flex={1}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
                        {item.product.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                        {item.product.short_characteristics || 'Краткое описание не указано'}
                    </Typography>
                    <Typography variant='body1' sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {item.product.price.toLocaleString('ru-RU')} ₽
                    </Typography>
                </Box>
                <Box display='flex' alignItems='center' mt={{ xs: 2, sm: 0 }}>
                    <IconButton onClick={onDecrease} disabled={item.quantity <= 1} sx={{ color: theme.palette.primary.main }}>
                        <Remove />
                    </IconButton>
                    <Typography variant='body1' sx={{ mx: 2 }}>
                        {item.quantity}
                    </Typography>
                    <IconButton onClick={onIncrease} sx={{ color: theme.palette.primary.main }}>
                        <Add />
                    </IconButton>
                    <IconButton onClick={onRemove} sx={{ color: theme.palette.error.main, ml: 2 }}>
                        <Delete />
                    </IconButton>
                </Box>
            </Box>
        </>
    );
};

export default CartItemComponent;
