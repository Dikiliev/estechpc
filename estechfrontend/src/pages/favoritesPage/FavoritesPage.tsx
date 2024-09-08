import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import ErrorText from '@components/errorText/ErrorText';
import ProductList from '@components/productList/ProductList';
import { FAVORITES_QUERY, useFavorites } from '@hooks/useFavorites';
import BaseEmptyState from '@components/BaseEmptyState/BaseEmptyState';
import noLikeIcon from '@assets/images/free-icon-heart-4048416.png';

const FavoritesPage: React.FC = () => {
    const { favoritesList, isLoading, isError } = useFavorites();
    const items = favoritesList ? favoritesList.items.map((favorite) => favorite.product) : [];

    if (isError) {
        return (
            <Container maxWidth='lg'>
                <Typography variant='h4' sx={{ textAlign: 'center', mt: 4 }}>
                    Нет избранных товаров
                </Typography>
                {isError && <ErrorText>Ошибка загрузки избранных товаров.</ErrorText>}
            </Container>
        );
    }

    if (!isLoading && favoritesList?.items.length === 0) {
        return <BaseEmptyState title={'Нет избранных товаров'} icon={noLikeIcon} buttons={[{ name: 'Перейти в каталог', url: '/catalog' }]} />;
    }

    return (
        <Container maxWidth='xl' sx={{ py: 4 }}>
            <Typography variant='h4' component='h1' gutterBottom>
                Избранные товары
            </Typography>

            <Grid item xs={12} sm={9} sx={{ paddingTop: '0 !important', marginTop: 0 }}>
                <ProductList isLoading={isLoading} products={items} queryKeys={[FAVORITES_QUERY]} />
            </Grid>
        </Container>
    );
};

export default FavoritesPage;
