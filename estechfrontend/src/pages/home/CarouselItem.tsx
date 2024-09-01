import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';

export interface CarouselItemProps {
    imageUrl: string;
    content: ReactNode;
    overlayOpacity: number;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ imageUrl, content, overlayOpacity = 0 }) => {
    return (
        <Box
            sx={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: 500,
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                position: 'relative',
                zIndex: 1,
                borderRadius: 1,
            }}
        >
            <Box
                sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`, zIndex: -1 }}
            />
            <Container maxWidth={'xl'} sx={{ display: 'flex', flexDirection: 'column' }}>
                {content}
            </Container>
        </Box>
    );
};

export default CarouselItem;
