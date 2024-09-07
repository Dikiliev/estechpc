import React from 'react';
import { Paper, Typography, Button, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import theme from '@styles/theme';
import { ICartItem as CartItemType } from 'types/cart';
import { formatPrice } from '@utils/formatPrice';

interface CartSummaryProps {
    selectedItems: CartItemType[];
    totalAmount: number;
    isCheckoutDisabled: boolean;
    onCheckout: () => void;
}

const CartSummaryComponent: React.FC<CartSummaryProps> = ({ selectedItems, totalAmount, isCheckoutDisabled, onCheckout }) => {
    return (
        <Paper
            sx={{
                width: '100%',
                height: 'max-content',
                padding: theme.spacing(3),
                borderRadius: 2,
                boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
                mb: { xs: 4, sm: 0 },
            }}
            elevation={0}
        >
            <Typography variant='h5' sx={{ mb: 2, textAlign: 'right', fontWeight: 'bold' }}>
                Сумма:{' '}
                <Typography variant='h5' color='primary' component='span'>
                    {formatPrice(totalAmount)}
                </Typography>
            </Typography>

            <Button
                variant='contained'
                color='primary'
                onClick={onCheckout}
                sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    padding: theme.spacing(1.5, 5),
                    borderRadius: 2,
                    width: '100%',
                    mb: 2,
                }}
                disabled={isCheckoutDisabled}
            >
                Перейти к оформлению
            </Button>

            <Divider sx={{ my: 2 }} />
            {!isCheckoutDisabled ? (
                <>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        Ваша корзина
                    </Typography>
                    <List disablePadding>
                        {selectedItems.map((item) => (
                            <ListItem key={item.id} disableGutters>
                                <ListItemText primary={`${item.product.name}`} secondary={`Количество: ${item.quantity}`} />
                                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                                    {item.product.price.toLocaleString('ru-RU')} ₽
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </>
            ) : (
                <Alert icon={<InfoIcon />} severity='warning'>
                    <Typography variant='body1'>Выберите товары, чтобы перейти к оформлению заказа</Typography>
                </Alert>
            )}
        </Paper>
    );
};

export default CartSummaryComponent;
