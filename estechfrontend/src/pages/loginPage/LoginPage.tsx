import { TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@stores/StoreContext';
import { useCart } from '@hooks/useCart';
import { useFavorites } from '@hooks/useFavorites';
import Form from '@components/form/Form';

const LoginPage = observer(() => {
    const { authStore } = useStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { syncLocalCartToServer } = useCart();
    const { syncLocalFavoritesToServer } = useFavorites();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        authStore.clearErrors();

        await authStore.login({ username, password });

        if (!authStore.hasErrors()) {
            syncLocalCartToServer();
            syncLocalFavoritesToServer();
            navigate('/');
        }

        setLoading(false);
    };

    const handleNavigateToRegister = () => {
        navigate('/register'); // Переход на страницу регистрации
    };

    return (
        <Form onSubmit={handleSubmit} title='Вход'>
            <TextField label='Имя пользователя' value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin='normal' required />
            <TextField
                label='Пароль'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin='normal'
                required
            />
            <Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Войти'}
            </Button>
            <Button variant='text' fullWidth size={'small'} component='a' sx={{ mt: 2 }} onClick={handleNavigateToRegister}>
                Нет аккаунта? Зарегистрируйтесь
            </Button>
        </Form>
    );
});

export default LoginPage;
