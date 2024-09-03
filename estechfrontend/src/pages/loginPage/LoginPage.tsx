import { TextField, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@stores/StoreContext';

const LoginPage = observer(() => {
    const { authStore } = useStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        authStore.clearErrors();

        await authStore.login({ username, password });

        if (!authStore.hasErrors()) {
            navigate('/');
        }

        setLoading(false);
    };

    const handleNavigateToRegister = () => {
        navigate('/register'); // Переход на страницу регистрации
    };

    return (
        <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 300, margin: 'auto', mt: 5 }}>
            <Typography variant='h5' component='h1' gutterBottom>
                Вход
            </Typography>
            {authStore.hasErrors() && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    {authStore.getErrorMessages()}
                </Alert>
            )}
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
            <Typography
                variant='body2'
                component='a'
                sx={{ mt: 2, display: 'block', textAlign: 'center', color: 'primary.main', cursor: 'pointer' }}
                onClick={handleNavigateToRegister}
            >
                Нет аккаунта? Зарегистрируйтесь
            </Typography>
        </Box>
    );
});

export default LoginPage;
