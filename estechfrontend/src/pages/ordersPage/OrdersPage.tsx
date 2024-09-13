import React, { useState } from 'react';
import { Box, Container, Typography, List, Pagination } from '@mui/material';
import { useOrders } from 'src/hooks/useOrders';
import OrderCard from './OrderCard';
import BaseEmptyState from '@components/BaseEmptyState/BaseEmptyState';
import noOrdersIcon from '@assets/images/free-icon-heart-40484161.png';

const OrdersPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { orders, isLoading, isError, totalPages } = useOrders({ page: currentPage });

    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const handleToggle = (orderId: number) => {
        setExpandedOrderId((prevOrderId) => (prevOrderId === orderId ? null : orderId));
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    if (isLoading) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <Typography variant='h6'>Загрузка заказов...</Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Container>
                <Typography variant='h6' color='error' align='center' gutterBottom>
                    Произошла ошибка при загрузке заказов.
                </Typography>
            </Container>
        );
    }

    if (orders.length === 0) {
        return <BaseEmptyState title={'У вас нет заказов'} icon={noOrdersIcon} buttons={[{ name: 'Перейти в корзину', url: '/cart' }]} />;
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant='h4' gutterBottom>
                Мои заказы
            </Typography>
            <List>
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} isExpanded={expandedOrderId === order.id} onToggle={() => handleToggle(order.id)} />
                ))}
            </List>
            <Box display='flex' justifyContent='center'>
                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color='primary' />
            </Box>
        </Container>
    );
};

export default OrdersPage;
