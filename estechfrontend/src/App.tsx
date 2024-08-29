import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Header from '@components/header/Header';
import Home from '@pages/home/Home';
import theme from '@styles/theme';
import '@styles/global.css';
import '@styles/globalStyles';

// Страницы пользовательской части
import TestPage from '@pages/TestPage';
import LoginPage from '@pages/loginPage/LoginPage';
import RegisterPage from '@pages/auth/registerPage/RegisterPage';
import Logout from '@pages/auth/Logout';
import CategorySelector from '@pages/categorySelector/CategorySelector';
import ProductsPage from '@pages/productsPage/ProductsPage';
import AllProductsPage from '@pages/allProductsPage/AllProductsPage';
import ProductPage from '@pages/productPage/ProductPage';
import ProfilePage from '@pages/auth/profilePage/ProfilePage';
import FavoritesPage from '@pages/favoritesPage/FavoritesPage';
import CartPage from '@pages/cartPage/CartPage';
import CheckoutPage from '@pages/checkoutPage/CheckoutPage';
import OrdersPage from '@pages/ordersPage/OrdersPage';
import OrderSuccessPage from '@pages/orderSuccessPage/OrderSuccessPage';

// Страницы админской панели
import AdminSidebar from '@admin/components/sidebar/AdminSidebar';
import CategoriesPage from '@admin/pages/categories/CategoriesPage';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Header />
                <Routes>
                    {/* Пользовательские маршруты */}
                    <Route path='/' element={<Home />} />
                    <Route path='/test' element={<TestPage />} />
                    <Route path='/catalog' element={<AllProductsPage />} />

                    <Route path='/categories/:parentId?' element={<CategorySelector />} />
                    <Route path='/categories/:categoryId/products' element={<ProductsPage />} />

                    <Route path='/favorites' element={<FavoritesPage />} />

                    <Route path='/products/:productId' element={<ProductPage />} />

                    <Route path='/cart' element={<CartPage />} />
                    <Route path='/checkout' element={<CheckoutPage />} />
                    <Route path='/order-success' element={<OrderSuccessPage />} />

                    <Route path='/orders' element={<OrdersPage />} />

                    <Route path='/profile' element={<ProfilePage />} />

                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route path='/logout' element={<Logout />} />

                    <Route path='admincategories' element={<CategoriesPage />} />

                    {/* Админские маршруты */}
                    <Route path='/admin' element={<AdminSidebar />}>
                        <Route index element={<CategoriesPage />} />
                        <Route path='categories' element={<CategoriesPage />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
