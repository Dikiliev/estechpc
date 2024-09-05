import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, CircularProgress, Paper } from '@mui/material';
import { useCart } from '@hooks/useCart';
import ErrorText from '@components/errorText/ErrorText';
import CartItemComponent from './CartItemComponent';
import CartSummaryComponent from './CartSummaryComponent';
import CartActionsComponent from './CartActionsComponent';
import FixedBottomBar from './FixedBottomBar';
import theme from '@styles/theme';
import { useNavigate } from 'react-router-dom';
import CartEmptyStateComponent from '@pages/cartPage/CartEmptyStateComponent';
import { useStore } from '@stores/StoreContext';

const CartPage: React.FC = () => {
    const { authStore } = useStore();

    const { cart, isLoadingCart, isErrorCart, error, clearCart, isClearing, updateCartItem, removeProductFromCart } = useCart();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const summaryRef = useRef<HTMLDivElement>(null);
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (cart) {
            setSelectedItems(cart.items.map((item) => item.id));
        }

        const handleScroll = () => {
            if (summaryRef.current) {
                const summaryTop = summaryRef.current.getBoundingClientRect().top;
                setIsSummaryVisible(summaryTop <= window.innerHeight);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [cart]);

    const handleIncrease = (itemId: number, currentQuantity: number) => {
        updateCartItem({ itemId, quantity: currentQuantity + 1 });
    };

    const handleDecrease = (itemId: number, currentQuantity: number) => {
        if (currentQuantity > 1) {
            updateCartItem({ itemId, quantity: currentQuantity - 1 });
        }
    };

    const handleRemove = (itemId: number) => {
        removeProductFromCart(itemId);
    };

    const handleSelectItem = (itemId: number) => {
        setSelectedItems((prevSelected) => (prevSelected.includes(itemId) ? prevSelected.filter((id) => id !== itemId) : [...prevSelected, itemId]));
    };

    const getTotalAmount = () => {
        if (!cart) return 0;
        return cart.items.filter((item) => selectedItems.includes(item.id)).reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const getSelectedItems = () => {
        if (!cart) return [];
        return cart.items.filter((item) => selectedItems.includes(item.id));
    };

    const handleCheckout = () => {
        if (authStore.isAuthenticated) {
            navigate('/checkout');
            return;
        }

        navigate('/login');
    };

    if (isLoadingCart) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress />
            </Box>
        );
    }

    if (isErrorCart || !cart) {
        console.log(error);
        return <ErrorText>Ошибка загрузки корзины.</ErrorText>;
    }

    if (cart.items.length === 0) {
        return <CartEmptyStateComponent />;
    }

    return (
        <Container maxWidth='lg' sx={{ py: 4 }}>
            <Box display='flex' justifyContent='space-between' flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                <Box width={{ xs: '100%', sm: '70%' }} mb={{ xs: 2, sm: 0 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            padding: theme.spacing(3),
                            borderRadius: 2,
                            boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
                        }}
                    >
                        {cart.items.map((item) => (
                            <CartItemComponent
                                key={item.id}
                                item={item}
                                selected={selectedItems.includes(item.id)}
                                onSelect={() => handleSelectItem(item.id)}
                                onIncrease={() => handleIncrease(item.id, item.quantity)}
                                onDecrease={() => handleDecrease(item.id, item.quantity)}
                                onRemove={() => handleRemove(item.id)}
                            />
                        ))}
                        <CartActionsComponent isClearing={isClearing} onClearCart={clearCart} />
                    </Paper>
                </Box>
                <Box width={{ xs: '100%', sm: '30%' }} ref={summaryRef}>
                    <CartSummaryComponent
                        selectedItems={getSelectedItems()}
                        totalAmount={getTotalAmount()}
                        isCheckoutDisabled={selectedItems.length === 0}
                        onCheckout={handleCheckout}
                    />
                </Box>
            </Box>
            {!isSummaryVisible && (
                <FixedBottomBar totalAmount={getTotalAmount()} isCheckoutDisabled={selectedItems.length === 0} onCheckout={handleCheckout} />
            )}
        </Container>
    );
};

export default CartPage;
