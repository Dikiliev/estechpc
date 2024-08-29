import React from 'react';
import { Box, Breadcrumbs, Link, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '@styles/theme';
import { ParentCategory } from 'types/category';

interface BreadcrumbsComponentProps {
    categoryPath: ParentCategory[] | undefined;
}

export const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = ({ categoryPath }) => {
    const navigate = useNavigate();

    // Если categoryPath загружен, отображаем хлебные крошки
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
                Главная
            </Link>

            {categoryPath ? (
                categoryPath.map((cat, index) =>
                    index === categoryPath.length - 1 ? (
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
                )
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Skeleton width={150} />
                    <Skeleton width={150} />
                </Box>
            )}
        </Breadcrumbs>
    );
};
