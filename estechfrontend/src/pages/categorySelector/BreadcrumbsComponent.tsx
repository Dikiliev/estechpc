import React from 'react';
import { Box, Breadcrumbs, Link, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '@styles/theme';
import { useCategoryPath } from '@hooks/useCategories';

interface BreadcrumbsComponentProps {
    categoryId: number | null;
    lastClickable?: boolean;
}

export const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = ({ categoryId, lastClickable = false }) => {
    const { data: categoryPath, isLoading } = useCategoryPath(categoryId);
    const navigate = useNavigate();

    const renderSkeletons = () => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Skeleton width={150} />
            <Skeleton width={150} />
        </Box>
    );

    const renderBreadcrumbs = () =>
        categoryPath?.map((cat, index) => {
            const isLast = index === categoryPath.length - 1;
            if (isLast && !lastClickable) {
                return (
                    <Typography key={cat.id} color={'text.secondary'}>
                        {cat.name}
                    </Typography>
                );
            }
            return (
                <Link
                    key={cat.id}
                    color='inherit'
                    underline='none'
                    onClick={() => navigate(`/categories/${cat.id}${isLast ? '/products' : ''}`)}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            color: theme.palette.primary.main,
                        },
                    }}
                >
                    {cat.name}
                </Link>
            );
        });

    return (
        <Breadcrumbs separator='›' aria-label='breadcrumb' sx={{ mb: 5 }} color={'text.main'}>
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
                Каталог
            </Link>
            {isLoading ? renderSkeletons() : renderBreadcrumbs()}
        </Breadcrumbs>
    );
};
