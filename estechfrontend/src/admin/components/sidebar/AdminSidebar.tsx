import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    Drawer,
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Category as CategoryIcon, Home as HomeIcon } from '@mui/icons-material';

const drawerWidth = 250;

const AdminSidebar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const closeDrawer = () => {
        if (isMobile) {
            setOpen(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <CssBaseline />
            <AppBar
                position='fixed'
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
                    ml: open ? `${drawerWidth}px` : 0,
                }}
            >
                <Toolbar>
                    <IconButton color='inherit' aria-label='open drawer' onClick={toggleDrawer} edge='start' sx={{ mr: 2 }}>
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant='h6' noWrap component='div'>
                        Админ-панель
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={open}
                onClose={toggleDrawer}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        transition: theme.transitions.create(['width', 'opacity'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.standard,
                        }),
                        overflowX: 'hidden',
                        ...(open
                            ? {
                                  opacity: 1,
                                  transform: 'translateX(0)',
                              }
                            : {
                                  opacity: 0,
                                  transform: 'translateX(-100%)',
                              }),
                    },
                }}
            >
                <Toolbar>
                    <Typography variant='h6' noWrap component='div'>
                        EstechPC
                    </Typography>
                </Toolbar>
                <Divider />
                <List>
                    <ListItem button component={Link} to='/admin' onClick={closeDrawer}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary='Главная' />
                    </ListItem>
                    <ListItem button component={Link} to='/admin/categories' onClick={closeDrawer}>
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText primary='Категории' />
                    </ListItem>
                </List>
            </Drawer>

            <Box
                component='main'
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginLeft: !open ? `-${drawerWidth}px` : 0,
                    transition: theme.transitions.create(['margin-left', 'opacity'], {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.standard,
                    }),
                }}
                onClick={closeDrawer}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminSidebar;
