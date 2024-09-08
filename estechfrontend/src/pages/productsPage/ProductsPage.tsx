import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Container, CircularProgress } from '@mui/material';
import ProductList from '@components/productList/ProductList';
import LoadingBox from '@components/loadingBox/LoadingBox';
import ErrorText from '@components/errorText/ErrorText';
import { useProductFilters } from '@hooks/useProductFilters';
import { useProducts } from '@hooks/useProducts';
import { useFilters } from '@hooks/useFilters';
import theme from '@styles/theme';
import FiltersPanel from '@components/filtersPanel/FiltersPanel';
import FiltersDrawer from '@pages/productsPage/FiltersDrawer';
import { BreadcrumbsComponent } from '@pages/categorySelector/BreadcrumbsComponent';

const ProductsPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const categoryID = parseInt(categoryId as string, 10);

    const { selectedFilters, priceRange, updateFilters, updatePriceRange } = useProductFilters();
    const [draftFilters, setDraftFilters] = React.useState(selectedFilters);
    const [draftPriceRange, setDraftPriceRange] = React.useState(priceRange);

    const { products, ref, isFetchingNextPage, productsLoading, productsError } = useProducts(categoryID, selectedFilters, priceRange);
    const { filters, filtersLoading, filtersError } = useFilters(categoryID);

    const applyFilters = () => {
        updateFilters(draftFilters);
        updatePriceRange(draftPriceRange);
    };

    if (productsError || filtersError) {
        return <ErrorText>Ошибка загрузки данных.</ErrorText>;
    }

    return (
        <Container maxWidth='xl' sx={{ py: 8 }}>
            <BreadcrumbsComponent categoryId={categoryID} />
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'right' }}>
                    <FiltersDrawer
                        filters={filters}
                        draftFilters={draftFilters}
                        setDraftFilters={setDraftFilters}
                        draftPriceRange={draftPriceRange}
                        setDraftPriceRange={setDraftPriceRange}
                        applyFilters={applyFilters}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={3}
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        position: 'sticky',
                        top: theme.spacing(8),
                        alignSelf: 'flex-start',
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 1,
                        overflowY: 'auto',
                        maxHeight: 'calc(100vh - 64px)',
                        padding: 2,
                    }}
                >
                    <FiltersPanel
                        isLoading={filtersLoading}
                        filters={filters}
                        selectedFilters={draftFilters}
                        priceRange={draftPriceRange}
                        onFilterChange={setDraftFilters}
                        onPriceRangeChange={setDraftPriceRange}
                        onApply={applyFilters}
                    />
                </Grid>

                <Grid item xs={12} sm={9} sx={{ paddingTop: '0 !important', marginTop: 0 }}>
                    <ProductList isLoading={productsLoading} products={products} queryKeys={[[categoryID, selectedFilters, priceRange]]} />
                    <div ref={ref} style={{ textAlign: 'center', marginTop: 16 }}>
                        {isFetchingNextPage && <CircularProgress />}
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductsPage;
