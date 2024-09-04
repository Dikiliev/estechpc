import React, { useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Box, IconButton } from '@mui/material';
import { IProduct } from 'types/products';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_PRODUCT_IMAGE } from '@utils/constans';
import CustomRating from '@components/rating/CustomRating';
import { useFavorites } from '@hooks/useFavorites';
import FavoriteButton from '@components/favoriteButton/FavoriteButton';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

import theme from '@styles/theme';
import { useCart } from '@hooks/useCart';

export interface ProductListProps {
    products: IProduct[];
    queryKeys: unknown[][];
}

const ProductList: React.FC<ProductListProps> = ({ products, queryKeys }) => {
    const navigate = useNavigate();

    const { cart, addProductToCart, isAdding: isCartAdding, isRemoving: isCartRemoving } = useCart();
    const { favoritesList, toggleFavorite, isAdding: isFavoriteAdding, isRemoving: isFavoriteRemoving } = useFavorites(queryKeys);

    const [cartClickedItems, setCartClickedItems] = useState<number[]>([]);
    const [favoriteClickedItems, setFavoriteClickedItems] = useState<number[]>([]);

    const isFavoriteLoading = isFavoriteAdding || isFavoriteRemoving;
    const isCartLoading = isCartAdding || isCartRemoving;

    const changeFavorite = (productId: number, isFavorite: boolean) => {
        if (!isFavoriteLoading) {
            setFavoriteClickedItems([productId]);
        } else {
            setFavoriteClickedItems((prev) => [...prev, productId]);
        }

        toggleFavorite(productId, isFavorite);
        setFavoriteClickedItems((prev) => [...prev, productId]);
    };

    const addCartHandle = (event: React.MouseEvent<HTMLElement>, productId: number) => {
        event.stopPropagation();

        if (!isCartLoading) {
            setCartClickedItems([productId]);
        } else {
            setCartClickedItems((prev) => [...prev, productId]);
        }

        addProductToCart({ productId: productId, quantity: 1 });
    };

    const toCartHandle = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        navigate('/cart');
    };

    return (
        <Grid container spacing={2}>
            {products.map((product) => {
                const isInCart = cart?.items.some((item) => item.product.id === product.id);
                const isInFavorite = favoritesList?.items.some((item) => item.product.id === product.id);

                return (
                    <Grid item xs={12} sm={6} md={4} xl={3} key={product.id}>
                        <Card
                            onClick={() => navigate(`/products/${product.id}`)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                borderRadius: 1,
                                overflow: 'hidden',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: 3,
                                },
                            }}
                        >
                            <CardMedia
                                component='img'
                                height='200'
                                image={(product.photos[0] && product.photos[0].photo) || DEFAULT_PRODUCT_IMAGE}
                                alt={product.name}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent
                                sx={{ textAlign: 'left', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                            >
                                <Box>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {product.name}
                                    </Typography>
                                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>
                                        {product.short_characteristics || 'Краткие характеристики не указаны'}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
                                        <Typography variant='h6' sx={{ color: 'primary.main', flex: 1 }}>
                                            {product.price.toLocaleString('ru-RU')} ₽
                                        </Typography>

                                        <FavoriteButton
                                            productId={product.id}
                                            isFavorite={!!isInFavorite}
                                            toggleFavorite={changeFavorite}
                                            isLoading={favoriteClickedItems.includes(product.id) && isFavoriteLoading}
                                            sx={{ backgroundColor: theme.palette.background.default, borderRadius: 1 }}
                                        />

                                        <IconButton
                                            onClick={isInCart ? (event) => toCartHandle(event) : (event) => addCartHandle(event, product.id)}
                                            disabled={cartClickedItems.includes(product.id) && isCartLoading}
                                            sx={{
                                                color: 'primary.contrastText',
                                                backgroundColor: 'primary.main',
                                                borderRadius: 1,

                                                '&:hover': {
                                                    color: 'primary.contrastText',
                                                    backgroundColor: 'primary.light',
                                                },
                                            }}
                                        >
                                            {isInCart ? <CheckRoundedIcon /> : <ShoppingCartRoundedIcon />}
                                        </IconButton>
                                    </Box>

                                    <CustomRating averageRating={product.average_rating} countOfReviews={product.count_of_reviews} />
                                    <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1 }}>
                                        Заказы: {product.count_of_orders}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default ProductList;
