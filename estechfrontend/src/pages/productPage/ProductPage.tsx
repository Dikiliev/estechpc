// src/components/ProductPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Grid } from '@mui/material';
import { fetchProductById } from '@api/products';
import ProductPhotos from './ProductPhotos';
import ErrorText from '@components/errorText/ErrorText';

import { IProductDetail } from 'types/products';
import ProductDetails from './ProductDetails';
import ProductTabs from './ProductTabs';
import LoadingBox from '@components/loadingBox/LoadingBox';
import { BreadcrumbsComponent } from '@pages/categorySelector/BreadcrumbsComponent';

const ProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();

    const {
        data: product,
        isLoading,
        isError,
    } = useQuery<IProductDetail>({
        queryKey: ['product', Number(productId)],
        queryFn: () => fetchProductById(productId!),
        enabled: !!productId,
    });

    if (isLoading) return <LoadingBox />;
    if (isError || !product) return <ErrorText>Ошибка загрузки данных товара.</ErrorText>;

    return (
        <Container maxWidth='lg' sx={{ my: 4, py: 4, backgroundColor: 'background.paper', borderRadius: 2 }}>
            <BreadcrumbsComponent categoryId={product.category} lastClickable />
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <ProductPhotos photos={product.photos} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <ProductDetails product={product} />
                </Grid>

                <Grid item xs={12}>
                    <ProductTabs product={product} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductPage;
