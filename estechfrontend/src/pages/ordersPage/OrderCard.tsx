import React from 'react';
import { Card, CardContent, Collapse, Grid, Typography, Box, Button, List, Avatar, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { IOrder } from 'src/types/order';
import OrderItem from './OrderItem';
import { DEFAULT_PRODUCT_IMAGE } from '@utils/constans';
import OrderStatusChip from '@pages/ordersPage/OrderStatusChip';
import { formatPrice } from '@utils/formatPrice';

interface OrderCardProps {
    order: IOrder;
    isExpanded: boolean;
    onToggle: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isExpanded, onToggle }) => {
    return (
        <Card elevation={0} sx={{ mb: 2, p: 1 }} onClick={onToggle}>
            <CardContent>
                <Grid container justifyContent='space-between' alignItems='center'>
                    <Grid item>
                        <Typography variant='actayWide'>
                            Заказ №{order.id} <Typography component='span'>от {new Date(order.created_at).toLocaleDateString()}</Typography>
                            {'\u00A0 \u00A0 \u00A0'}
                            <OrderStatusChip status={order.status} statusDisplay={order.status_display} />
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Button variant='text' endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
                            {isExpanded ? 'Скрыть детали' : 'Подробнее'}
                        </Button>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Collapse in={!isExpanded} timeout='auto' unmountOnExit>
                    <Grid container sx={{ mt: 2 }}>
                        <Grid item md={10} container spacing={1}>
                            {order.items.map((item) => (
                                <Grid item key={item.id}>
                                    <Avatar
                                        variant='rounded'
                                        src={(item.product.photos[0] && item.product.photos[0].photo) || DEFAULT_PRODUCT_IMAGE}
                                        alt={item.product.name}
                                        sx={{ width: 48, height: 48, borderRadius: 2 }}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Grid item md={2} sx={{ mt: 'auto' }}>
                            <Typography variant='h6' align={'right'}>
                                {formatPrice(order.price)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Collapse>

                <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                    <Typography variant='body1'>
                        <Typography color='textSecondary' component='span'>
                            Способ получения:
                        </Typography>{' '}
                        {order.delivery_method_display} {order.address && `(${order.address})`}
                    </Typography>
                    <Typography variant='body1'>
                        <Typography color='textSecondary' component='span'>
                            Контактная информация:
                        </Typography>{' '}
                        {order.contact_info} ({order.contact_method_display})
                    </Typography>

                    <Divider sx={{ my: 2 }} />
                    <List sx={{ mt: 2 }}>
                        {order.items.map((item) => (
                            <OrderItem key={item.id} item={item} />
                        ))}
                    </List>
                    <Box display='flex' justifyContent='flex-end' mt={2}>
                        <Typography variant='body1'>
                            Итого:{' '}
                            <Typography variant='h6' component={'span'}>
                                {formatPrice(order.price)}
                            </Typography>
                        </Typography>
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
