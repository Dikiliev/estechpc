import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCategories, useCategoryPath } from '@hooks/useCategories';
import LoadingBox from '@components/loadingBox/LoadingBox';
import ErrorText from '@components/errorText/ErrorText';
import { Category } from 'types/category';
import { BreadcrumbsComponent } from '@pages/categorySelector/BreadcrumbsComponent';
import { CategoryCard } from '@pages/categorySelector/CategoryCard';
import { fetchChildrenCategories } from '@api/category';

const CategorySelector: React.FC = () => {
    const { parentId } = useParams<{ parentId: string }>();
    const navigate = useNavigate();
    const selectedCategoryId = parentId ? parseInt(parentId, 10) : null;

    const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories(selectedCategoryId);
    const { data: categoryPath, isLoading: pathLoading, isError: pathError } = useCategoryPath(selectedCategoryId);

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

    if (categoriesLoading || pathLoading) {
        return <LoadingBox />;
    }

    if (categoriesError || pathError) {
        return <ErrorText>Ошибка загрузки категорий.</ErrorText>;
    }

    return (
        <Container maxWidth={'xl'} sx={{ py: 4 }}>
            {categoryPath && <BreadcrumbsComponent categoryPath={categoryPath} />}
            <Typography variant='h4' gutterBottom>
                Выберите категорию
            </Typography>
            <Grid container spacing={2}>
                {categories?.map((category) => <CategoryCard key={category.id} category={category} onClick={handleCategoryClick} />)}
            </Grid>
        </Container>
    );
};

export default CategorySelector;
