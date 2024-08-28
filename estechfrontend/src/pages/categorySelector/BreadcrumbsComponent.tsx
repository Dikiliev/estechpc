import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '@styles/theme';
import { ParentCategory } from 'types/category';

interface BreadcrumbsComponentProps {
    categoryPath: ParentCategory[];
}

export const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = ({ categoryPath }) => {
    const navigate = useNavigate();

    return (
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
            {categoryPath.map((cat, index) =>
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
            )}
        </Breadcrumbs>
    );
};
