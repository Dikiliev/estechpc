import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Card, CardMedia, Grid, Container, Box, Breadcrumbs, Link } from '@mui/material';
import apiInstance from '@api/axios';
import theme from '@styles/theme';
import LoadingBox from '@components/loadingBox/LoadingBox';
import ErrorText from '@components/errorText/ErrorText';

interface Category {
    id: number;
    parent: Category | null;
    name: string;
    image: string | null;
}

interface ParentCategory {
    id: number;
    name: string;
}

interface ChildCategory {
    id: number;
    name: string;
}

const fetchCategories = async (parentId: number | null): Promise<Category[]> => {
    const response = await apiInstance.get<Category[]>(`/products/categories/?parent_id=${parentId !== null ? parentId : 0}`);
    return response.data;
};

const fetchChildrenCategories = async (categoryId: number): Promise<ChildCategory[]> => {
    const response = await apiInstance.get<ChildCategory[]>(`/products/categories/${categoryId}/children/`);
    return response.data;
};

const fetchCategoryPath = async (categoryId: number): Promise<ParentCategory[]> => {
    const response = await apiInstance.get<ParentCategory[]>(`/products/categories/${categoryId}/parents/?include_yourself=true`);
    return response.data;
};

const CategorySelector: React.FC = () => {
    const { parentId } = useParams<{ parentId: string }>();
    const navigate = useNavigate();
    const selectedCategoryId = parentId ? parseInt(parentId, 10) : null;

    const {
        data: categories,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery({
        queryKey: ['categories', selectedCategoryId],
        queryFn: () => fetchCategories(selectedCategoryId),
    });

    const {
        data: categoryPath,
        isLoading: pathLoading,
        isError: pathError,
    } = useQuery({
        queryKey: ['categoryPath', selectedCategoryId],
        queryFn: () => (selectedCategoryId ? fetchCategoryPath(selectedCategoryId) : Promise.resolve([])),
        enabled: selectedCategoryId !== null, // Выполнять запрос только если selectedCategoryId не null
    });

    const handleCategoryClick = async (category: Category) => {
        try {
            const children = await fetchChildrenCategories(category.id);
            if (children.length > 0) {
                navigate(`/categories/${category.id}`);
            } else {
                navigate(`/categories/${category.id}/products`);
            }
        } catch (error) {
            console.error('Ошибка загрузки дочерних категорий:', error);
            navigate(`/categories/${category.id}/products`);
        }
    };

    const defaultImage = 'https://via.placeholder.com/550';

    if (categoriesLoading || pathLoading) {
        return <LoadingBox />;
    }

    if (categoriesError || pathError) {
        return <ErrorText>Ошибка загрузки категорий.</ErrorText>;
    }

    return (
        <Container maxWidth={'xl'} sx={{ py: 4 }}>
            <Breadcrumbs separator='›' aria-label='breadcrumb' sx={{ mb: 2 }} color={'text.main'}>
                <Link
                    color='inherit'
                    underline='none'
                    onClick={() => navigate('/categories')}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            color: theme.palette.primary.main,
                        },
                    }}
                >
                    Главная
                </Link>
                {categoryPath?.map((cat, index) =>
                    index === categoryPath?.length - 1 ? (
                        <Typography key={cat.id} color={'text.secondary'}>
                            {cat.name}
                        </Typography>
                    ) : (
                        <Link
                            key={cat.id}
                            color='inherit'
                            underline='none'
                            onClick={() => navigate(`/categories/${cat.id}`)}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                },
                            }}
                        >
                            {cat.name}
                        </Link>
                    )
                )}
            </Breadcrumbs>
            <Typography variant='h4' gutterBottom>
                Выберите категорию
            </Typography>
            <Grid container spacing={2}>
                {Array.isArray(categories) &&
                    categories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                            <Card
                                onClick={() => handleCategoryClick(category)}
                                sx={{
                                    cursor: 'pointer',
                                    // border: `1px solid ${theme.palette.grey[800]}`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    // boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                <CardMedia component='img' height='280' image={category.image || defaultImage} alt={category.name} />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        padding: theme.spacing(1),
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography variant='h6' component='div'>
                                        {category.name}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Container>
    );
};

export default CategorySelector;
