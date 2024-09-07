import React, { useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Button, CardContent, Container, Typography } from '@mui/material';

import periphery from '@assets/images/pcs/periphery.jpg';
import banner_1 from '@assets/images/banners/pubg-1.png';
import banner_2 from '@assets/images/banners/banner-1.png';
import CarouselItem, { CarouselItemProps } from '@pages/home/CarouselItem';
import theme from '@styles/theme';
import { useNavigate } from 'react-router-dom';

const HomeCarousel: React.FC = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    const items: CarouselItemProps[] = [
        // {
        //     imageUrl: pc_1,
        //     title: 'Estech PC — надежность и скорость в каждом устройстве',
        //     description: 'Открой для себя новое измерение производительности с нашими топовыми компьютерами и комплектующими.',
        //     buttonText: 'Посмотреть каталог',
        //     buttonLink: '/categories',
        // },
        {
            imageUrl: banner_1,
            overlayOpacity: 0,
            content: (
                <CardContent sx={{ textAlign: 'right' }}>
                    <Typography variant='h4' gutterBottom>
                        Готовые игровые ПК
                    </Typography>
                    <Typography variant='subtitle1'>Заряжены и настроены на победу. Обеспечьте себе лучшее игровое впечатление.</Typography>

                    <Button variant='contained' size='large' color='primary' onClick={() => navigate('/catalog')} sx={{ mt: 2 }}>
                        Перейти в каталог
                    </Button>
                </CardContent>
            ),
        },
        {
            imageUrl: banner_2,
            overlayOpacity: 0,
            content: (
                <CardContent>
                    <Typography variant='h4' gutterBottom>
                        Готовые игровые ПК
                    </Typography>
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                        Заряжены и настроены на победу. Обеспечьте себе лучшее игровое впечатление.
                    </Typography>

                    <Button variant='contained' size='large' color='primary' onClick={() => navigate('/catalog')} sx={{ mt: 2 }}>
                        Перейти в каталог
                    </Button>
                </CardContent>
            ),
        },
        {
            imageUrl: periphery,
            overlayOpacity: 0.7,
            content: (
                <CardContent>
                    <Typography variant='h4' gutterBottom>
                        Готовые игровые ПК
                    </Typography>
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                        Заряжены и настроены на победу. Обеспечьте себе лучшее игровое впечатление.
                    </Typography>

                    <Button variant='contained' size='large' color='primary' onClick={() => navigate('/catalog')} sx={{ mt: 2 }}>
                        Перейти в каталог
                    </Button>
                </CardContent>
            ),
        },
    ];

    return (
        <Container maxWidth='xl' sx={{ position: 'relative', mb: 5 }}>
            <Carousel
                autoPlay={false}
                interval={6000}
                height={300}
                animation='slide'
                indicators={false}
                navButtonsAlwaysVisible={false}
                onChange={(now) => setActiveIndex(now ? now : 0)}
            >
                {items.map((item, index) => (
                    <CarouselItem key={index} {...item} />
                ))}
            </Carousel>

            {/* Кастомные линейные индикаторы */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    zIndex: 10,
                }}
            >
                {items.map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: `min(${100 / items.length}%, 100px)`,
                            height: '4px',
                            borderRadius: '4px',
                            backgroundColor: index === activeIndex ? 'primary.main' : theme.palette.grey[600],
                            transition: 'background-color 0.3s',
                        }}
                    />
                ))}
            </Box>
        </Container>
    );
};

export default HomeCarousel;
