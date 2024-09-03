import { TextField, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { observer } from 'mobx-react';
import { useStore } from '@stores/StoreContext';

const RegisterPage = observer(() => {
    const { authStore } = useStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        authStore.clearErrors();

        if (password !== password2) {
            authStore.addErrors({ password: ['Пароли не совпадают.'] }, true);
            setLoading(false);
            return;
        }

        await authStore.register({ username, email, password, password2 });

        if (!authStore.hasErrors()) {
            navigate('/');
        }

        setLoading(false);
    };

    return (
        <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 5, p: 2 }}>
            <Typography variant='h5' component='h1' gutterBottom>
                Регистрация
            </Typography>
            {authStore.hasErrors() && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    {authStore.getErrorMessages()}
                </Alert>
            )}
            <TextField label='Имя пользователя' value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin='normal' required />
            <TextField label='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin='normal' required />
            <TextField
                label='Пароль'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin='normal'
                required
            />
            <TextField
                label='Подтверждение пароля'
                type='password'
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                fullWidth
                margin='normal'
                required
            />
            <Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
            </Button>
            <Typography onClick={() => navigate('/login')} color={'primary'} variant='body2' sx={{ mt: 2, textAlign: 'center' }}>
                Уже есть аккаунт? Войти
            </Typography>
        </Box>
    );
});

export default RegisterPage;
