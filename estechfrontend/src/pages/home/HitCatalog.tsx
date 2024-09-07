import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Grid, Container, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import { fetchAllProducts } from '@api/products';
import ProductList from '@components/productList/ProductList';
import ErrorText from '@components/errorText/ErrorText';
import { useInView } from 'react-intersection-observer';
import LoadingBox from '@components/loadingBox/LoadingBox';
import { useProducts } from '@hooks/useProducts';
import { useParams } from 'react-router-dom';
import { useProductFilters } from '@hooks/useProductFilters';
import { useFilters } from '@hooks/useFilters';
import { BreadcrumbsComponent } from '@pages/categorySelector/BreadcrumbsComponent';
import FiltersDrawer from '@pages/productsPage/FiltersDrawer';
import theme from '@styles/theme';
import FiltersPanel from '@components/filtersPanel/FiltersPanel';

const categories = [
    { id: 1, name: 'Все категории' },
    { id: 2, name: 'Электроника' },
    { id: 3, name: 'Одежда' },
    { id: 4, name: 'Книги' },
    // Добавьте другие категории по необходимости
];

const HitCatalog: React.FC = () => {
    const categoryID = 0;

    const { products, ref, isFetchingNextPage, productsLoading, productsError } = useProducts(categoryID);

    if (productsLoading) {
        return <LoadingBox />;
    }

    if (productsError) {
        return <ErrorText>Ошибка загрузки данных.</ErrorText>;
    }

    return (
        <Container maxWidth='xl' sx={{ py: 4 }}>
            <Typography variant='h4' gutterBottom>
                Хиты продаж
            </Typography>

            {/* Табы для выбора категорий */}
            <Tabs
                // value={selectedCategory}
                // onChange={handleCategoryChange}
                variant='scrollable'
                scrollButtons='auto'
                aria-label='Категории продуктов'
                sx={{ mb: 3 }}
            >
                {categories.map((category) => (
                    <Tab key={category.id} label={category.name} value={category.id} />
                ))}
            </Tabs>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ProductList products={products} queryKeys={[categoryID]} />
                </Grid>
                <Grid item xs={12} ref={ref} sx={{ textAlign: 'center', mt: 2 }}>
                    {isFetchingNextPage && <CircularProgress />}
                </Grid>
            </Grid>
        </Container>
    );
};

export default HitCatalog;
