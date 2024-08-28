import React from 'react';
import { Card, CardMedia, Grid, Typography, Box } from '@mui/material';
import theme from '@styles/theme';
import { Category } from 'types/category';

interface CategoryCardProps {
    category: Category;
    onClick: (category: Category) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
    const defaultImage = 'https://via.placeholder.com/550';

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
                onClick={() => onClick(category)}
                sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
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
    );
};
