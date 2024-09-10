// src/components/AllProductsPage.tsx

import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Grid, Container, Typography, CircularProgress } from '@mui/material';
import { fetchAllProducts } from '@api/products';
import ProductList from '@components/productList/ProductList';
import ErrorText from '@components/errorText/ErrorText';
import { useInView } from 'react-intersection-observer';
import LoadingBox from '@components/loadingBox/LoadingBox';

const AllProductsPage: React.FC = () => {
    const { ref, inView } = useInView();

    const productsQuery = ['allProducts'];

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
        queryKey: productsQuery,
        queryFn: ({ pageParam = 1 }) => fetchAllProducts(pageParam),
        getNextPageParam: (lastPage) => {
            const nextUrl = lastPage.next;
            if (nextUrl) {
                const urlParams = new URLSearchParams(nextUrl.split('?')[1]);
                return urlParams.get('page') ? parseInt(urlParams.get('page')!) : undefined;
            }
            return undefined;
        },
        initialPageParam: 1,
    });

    React.useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (isLoading) {
        return <LoadingBox />;
    }

    if (isError) {
        return <ErrorText>Ошибка загрузки данных.</ErrorText>;
    }

    const products = data?.pages.flatMap((page) => page.results) || [];

    return (
        <Container maxWidth='xl' sx={{ py: 8 }}>
            <Typography variant='h4' gutterBottom>
                Все товары
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ProductList isLoading={isLoading} products={products} queryKeys={[productsQuery]} />
                </Grid>
                <Grid item xs={12} ref={ref} sx={{ textAlign: 'center', mt: 2 }}>
                    {isFetchingNextPage && <CircularProgress />}
                </Grid>
            </Grid>
        </Container>
    );
};

export default AllProductsPage;
