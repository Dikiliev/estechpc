// src/components/header/Header.tsx
import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Button, Container } from '@mui/material';

// import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';
import styles from './Header.module.css';
import Logo from '@assets/favicon.svg?react';
import IconWithLabel from './IconWithLabel';

import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import IconButton from '@mui/material/IconButton';
import theme from '@styles/theme';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStore } from '@stores/StoreContext';

import { useCart } from '@hooks/useCart';
import { useFavorites } from '@hooks/useFavorites';
import MenuIcon from '@mui/icons-material/Menu';

const Header: React.FC = observer(() => {
    const navigate = useNavigate();

    const { authStore, cartStore, favoritesStore } = useStore();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const { cart } = useCart();
    const { favoritesList } = useFavorites();

    useEffect(() => {
        if (cart) {
            const totalCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
            cartStore.setCartItemCount(totalCount);
        }
    }, [cart]);

    useEffect(() => {
        if (favoritesList) {
            const totalCount = favoritesList.items.length;
            favoritesStore.setFavoritesCount(totalCount);
        }
    }, [favoritesList]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Container maxWidth='xl'>
                    <Toolbar disableGutters sx={{ gap: 3 }}>
                        <Logo className={styles.logo} onClick={() => navigate('/')} />
                        <Button variant='contained' size={'large'} sx={{ px: 2 }} onClick={() => navigate('/categories')} endIcon={<MenuIcon />}>
                            Каталог
                        </Button>

                        {/*<SearchBar />*/}
                        <Box flexGrow={1}></Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex', gap: theme.spacing(5), alignItems: 'center' } }}>
                            <IconWithLabel
                                onClick={() => navigate('/orders')}
                                icon={<ReceiptLongIcon />}
                                label='Заказы'
                                badgeContent={0}
                                ariaLabel='show orders'
                            />
                            <IconWithLabel
                                onClick={() => navigate('/favorites')}
                                icon={<FavoriteIcon />}
                                label='Избранное'
                                badgeContent={favoritesStore.favoritesItemCount}
                                ariaLabel='show favorites'
                            />
                            <IconWithLabel
                                onClick={() => navigate('/cart')}
                                icon={<ShoppingCartIcon />}
                                label='Корзина'
                                badgeContent={cartStore.cartItemCount}
                                ariaLabel='show shopping cart'
                            />

                            {authStore.isAuthenticated ? (
                                <>
                                    <IconWithLabel
                                        icon={<AccountCircle />}
                                        label='Профиль'
                                        ariaLabel='account of current user'
                                        onClick={handleProfileMenuOpen}
                                    />
                                </>
                            ) : (
                                <Button variant='contained' onClick={() => navigate('/login')}>
                                    Войти
                                </Button>
                            )}
                        </Box>

                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size='large' aria-label='show more' aria-haspopup='true' onClick={handleMobileMenuOpen} color='inherit'>
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <ProfileMenu
                anchorEl={anchorEl}
                mobileMoreAnchorEl={mobileMoreAnchorEl}
                isMenuOpen={isMenuOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                handleMenuClose={handleMenuClose}
                handleMobileMenuClose={handleMobileMenuClose}
                handleProfileMenuOpen={handleProfileMenuOpen}
            />
        </Box>
    );
});

export default Header;
