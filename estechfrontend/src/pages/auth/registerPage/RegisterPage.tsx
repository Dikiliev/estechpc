import { TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { observer } from 'mobx-react';
import { useStore } from '@stores/StoreContext';
import { useCart } from '@hooks/useCart';
import { useFavorites } from '@hooks/useFavorites';
import Form from '@components/form/Form';

const RegisterPage = observer(() => {
    const { authStore } = useStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { syncLocalCartToServer } = useCart();
    const { syncLocalFavoritesToServer } = useFavorites();

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
            syncLocalCartToServer();
            syncLocalFavoritesToServer();
            navigate('/');
        }

        setLoading(false);
    };

    return (
        <Form onSubmit={handleSubmit} title='Регистрация'>
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
            <Button variant='text' fullWidth size={'small'} component='a' sx={{ mt: 2 }} onClick={() => navigate('/login')}>
                Уже есть аккаунт? Войти
            </Button>
        </Form>
    );
});

export default RegisterPage;
