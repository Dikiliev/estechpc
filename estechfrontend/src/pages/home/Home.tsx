import React from 'react';
import { Container } from '@mui/material';

import './Home.module.css';
import HomeCarousel from '@pages/home/HomeCarousel';
import HitCatalog from '@pages/home/HitCatalog';

const Home = () => {
    return (
        <Container maxWidth={'xl'} sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <HomeCarousel />

            <HitCatalog />
            {/*<StoreStats />*/}
        </Container>
    );
};

export default Home;
