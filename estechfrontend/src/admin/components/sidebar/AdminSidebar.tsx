import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: 200, bgcolor: 'background.paper' }}>
                <List component='nav'>
                    <ListItem button component={Link} to='/admin'>
                        <ListItemText primary='Главная' />
                    </ListItem>
                    <ListItem button component={Link} to='/admin/categories'>
                        <ListItemText primary='Категории' />
                    </ListItem>
                    {/* Другие ссылки на страницы админки */}
                </List>
            </Box>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                {/* Здесь будут отображаться компоненты, соответствующие вложенным маршрутам */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminSidebar;
