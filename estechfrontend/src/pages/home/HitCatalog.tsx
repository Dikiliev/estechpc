import React, { useState } from 'react';
import { Grid, Container, Typography, CircularProgress, Tabs, Tab, Skeleton, Button, tabsClasses } from '@mui/material';
import ProductList from '@components/productList/ProductList';
import ErrorText from '@components/errorText/ErrorText';
import { useProducts } from '@hooks/useProducts';
import { useCategories } from '@hooks/useCategories';
import theme from '@styles/theme';

const HitCatalog: React.FC = () => {
    const [categoryId, setCategoryId] = useState<number>(0);

    const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories({ hasProducts: true });
    const { products, ref, isFetchingNextPage, productsLoading, productsError } = useProducts(categoryId);

    const handleSetCategory = (event: React.SyntheticEvent, value: number) => {
        setCategoryId(value);
    };

    const renderTabsSkeletons = () => <Skeleton width={'100%'} height={48} sx={{ mb: '24px' }} />;

    if (productsError || categoriesError) {
        return <ErrorText>Ошибка загрузки данных.</ErrorText>;
    }

    return (
        <Container maxWidth='xl' sx={{ py: 4 }}>
            <Typography variant='h4' gutterBottom>
                Рекомендуем
            </Typography>

            {/* Табы для выбора категорий */}
            {!categoriesLoading ? (
                <Tabs
                    value={categoryId}
                    onChange={handleSetCategory}
                    aria-label='Категории продуктов'
                    variant='scrollable'
                    scrollButtons={'auto'}
                    sx={{
                        mb: 2,
                        [`& .${tabsClasses.scrollButtons}`]: {
                            '&.Mui-disabled': { opacity: 0.3 },
                        },
                    }}
                >
                    <Tab label={'Все категории'} value={0} />
                    {categories?.map((category) => <Tab key={category.id} label={category.name} value={category.id} />)}
                </Tabs>
            ) : (
                renderTabsSkeletons()
            )}

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ProductList products={products} isLoading={productsLoading} queryKeys={[[categoryId]]} />
                </Grid>
                <Grid item xs={12} ref={ref} sx={{ textAlign: 'center', mt: 2 }}>
                    {isFetchingNextPage && <CircularProgress />}
                </Grid>
            </Grid>
        </Container>
    );
};

export default HitCatalog;
