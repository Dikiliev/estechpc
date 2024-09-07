import React from 'react';
import { Box, Container } from '@mui/material';

import './Home.module.css';
import HomeCarousel from '@pages/home/HomeCarousel';
import HitCatalog from '@pages/home/HitCatalog';

const Home = () => {
    return (
        <Box sx={{ backgroundColor: 'pallett' }}>
            <Container maxWidth={'xl'} sx={{ py: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <HomeCarousel />

                <HitCatalog />
                {/*<StoreStats />*/}
            </Container>
        </Box>
    );
};

export default Home;
