import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Box,
    Collapse,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useCart } from '@hooks/useCart';
import IconButton from '@mui/material/IconButton';

import { useNavigate } from 'react-router-dom';
import { useOrders } from '@hooks/useOrders';
import { IOrderCreateData } from 'types/order';

const CheckoutPage: React.FC = () => {
    const { cart, removeSelectedItems } = useCart();
    const { createOrder } = useOrders();
    const navigate = useNavigate(); // Для навигации

    const [contactInfo, setContactInfo] = useState({
        phoneNumber: '',
        contactMethod: 'phone',
        address: '',
        deliveryMethod: 'pickup',
        termsAccepted: true,
    });
    const [isItemsVisible, setItemsVisible] = useState(false);

    const selectedItems = cart?.items?.filter((item) => item.is_selected);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = event.target;
        setContactInfo({
            ...contactInfo,
            [name]: name === 'termsAccepted' ? checked : value,
        });
    };

    const handleToggleItems = () => {
        setItemsVisible(!isItemsVisible);
    };

    const handlePlaceOrder = async () => {
        if (!cart || cart.items.length === 0) {
            alert('Ваша корзина пуста. Добавьте товары перед оформлением заказа.');
            return;
        }

        // Подготовка данных для заказа
        const orderData: IOrderCreateData = {
            delivery_method: contactInfo.deliveryMethod,
            contact_method: contactInfo.contactMethod,
            contact_info: contactInfo.phoneNumber,
            address: contactInfo.address,
            items: cart.items
                .filter((item) => item.is_selected)
                .map((item) => ({
                    product: item.product.id,
                    quantity: item.quantity,
                })),
        };

        try {
            await createOrder(orderData);
            removeSelectedItems();
            navigate('/order-success');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Произошла ошибка при создании заказа. Пожалуйста, попробуйте снова.');
        }
    };

    return (
        <Container maxWidth='md' sx={{ py: 4 }}>
            <Paper elevation={0} sx={{ padding: 3 }}>
                <Typography variant='h4' gutterBottom>
                    Оформление заказа
                </Typography>
                <Typography color='error'>
                    Внимание: На данный момент прямая оплата на сайте недоступна. После подтверждения заказа с вами свяжется наш менеджер для
                    уточнения деталей и возможных способов оплаты.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='body1'>Товары в корзине ({selectedItems?.length || 0})</Typography>
                    <IconButton onClick={handleToggleItems}>{isItemsVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                </Box>

                <Collapse in={isItemsVisible}>
                    <List disablePadding>
                        {selectedItems?.map((item) => (
                            <ListItem key={item.id} divider>
                                <ListItemText primary={item.product.name} secondary={`Количество: ${item.quantity}`} />
                                <Typography variant='body2'>{`${item.product.price} ₽`}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>

                <Typography variant='body1' sx={{ my: 2 }}>
                    Общая сумма:{' '}
                    <Typography component='span' variant={'h6'} color='primary'>
                        {cart?.total_amount}
                    </Typography>{' '}
                    ₽
                </Typography>

                <Box sx={{ padding: 2, marginBottom: 2 }}>
                    <FormControl component='fieldset'>
                        <FormLabel component='legend'>Способ связи</FormLabel>
                        <RadioGroup row name='contactMethod' value={contactInfo.contactMethod} onChange={handleChange}>
                            <FormControlLabel
                                value='phone'
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PhoneIcon sx={{ mr: 1 }} /> Звонок
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                value='whatsapp'
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <WhatsAppIcon sx={{ mr: 1 }} /> WhatsApp
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                value='telegram'
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <TelegramIcon sx={{ mr: 1 }} /> Telegram
                                    </Box>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        label={contactInfo.contactMethod === 'telegram' ? 'Telegram ник' : 'Номер телефона'}
                        fullWidth
                        margin='normal'
                        name='phoneNumber'
                        value={contactInfo.phoneNumber}
                        onChange={handleChange}
                    />

                    <FormControl component='fieldset' sx={{ mt: 2 }}>
                        <FormLabel component='legend'>Способ получения</FormLabel>
                        <RadioGroup row name='deliveryMethod' value={contactInfo.deliveryMethod} onChange={handleChange}>
                            <FormControlLabel value='pickup' control={<Radio />} label='Самовывоз' />
                            <FormControlLabel value='delivery' control={<Radio />} label='Доставка' />
                        </RadioGroup>
                    </FormControl>

                    {contactInfo.deliveryMethod === 'delivery' && (
                        <TextField label='Адрес' fullWidth margin='normal' name='address' value={contactInfo.address} onChange={handleChange} />
                    )}

                    <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={handlePlaceOrder}
                        disabled={!contactInfo.termsAccepted}
                    >
                        Подтвердить заказ
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CheckoutPage;
