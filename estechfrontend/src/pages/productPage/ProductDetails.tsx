// src/components/ProductDetails.tsx

import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { IProductDetail } from 'types/products';
import FlexBox from '@components/flexBox/FlexBox';
import CustomRating from '@components/rating/CustomRating';
import FavoriteButton from '@components/favoriteButton/FavoriteButton';
import { useFavorites } from '@hooks/useFavorites';
import { useCart } from '@hooks/useCart';
import { useNavigate } from 'react-router-dom';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';

interface ProductDetailsProps {
    product: IProductDetail;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
    const navigate = useNavigate();

    const { favoritesList, toggleFavorite, isAdding: isFavoriteAdding, isRemoving: isFavoriteRemoving } = useFavorites([['product', product.id]]);
    const { cart, addProductToCart, isAdding: isCartAdding, isRemoving: isCartRemoving } = useCart();

    const isFavoriteLoading = isFavoriteAdding || isFavoriteRemoving;
    const isCartLoading = isCartAdding || isCartRemoving;

    const isInCart = cart?.items.some((item) => item.product.id === product.id);
    const isInFavoritesList = favoritesList?.items.some((item) => item.product.id === product.id);

    const handleClickCart = () => {
        if (isInCart) {
            navigate('/cart');
            return;
        }

        addProductToCart({ productId: product.id, quantity: 1 });
    };

    return (
        <Box>
            <Typography variant='h4' component='h1' gutterBottom>
                {product.name}
            </Typography>
            <Typography variant='subtitle1' color='textSecondary' paragraph>
                {product.short_characteristics}
            </Typography>
            <Typography variant='h5' color='primary' sx={{ mb: 2 }}>
                {product.price.toLocaleString('ru-RU')} ₽
            </Typography>

            <CustomRating averageRating={product.average_rating} countOfReviews={product.count_of_reviews} />

            <FlexBox bgColor={'transparent'} sx={{ mt: 2 }}>
                <Button
                    variant='contained'
                    endIcon={isInCart ? <CheckRoundedIcon /> : <ShoppingCartRoundedIcon />}
                    color='primary'
                    size='large'
                    onClick={handleClickCart}
                    disabled={isCartLoading}
                >
                    {isInCart ? 'Перейти в корзину' : 'Добавить в корзину'}
                </Button>

                <FavoriteButton
                    productId={product.id}
                    isFavorite={!!isInFavoritesList}
                    toggleFavorite={toggleFavorite}
                    isLoading={isFavoriteLoading}
                />
            </FlexBox>
        </Box>
    );
};

export default ProductDetails;
