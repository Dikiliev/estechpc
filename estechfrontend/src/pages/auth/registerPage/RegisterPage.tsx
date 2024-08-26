import { TextField, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Импортируем Link
import React, { useState } from 'react';

import { register } from '@api/auth';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== password2) {
            setError('Пароли не совпадают.');
            setLoading(false);
            return;
        }

        try {
            const { error } = await register(username, email, password, password2, firstName, lastName);

            if (error) {
                let errors = '';

                for (const key in error) {
                    for (const item of error[key]) {
                        errors += item + '\n';
                    }
                }

                setError(errors || 'Произошла ошибка при регистрации.');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Произошла ошибка при регистрации.');
        }

        setLoading(false);
    };

    return (
        <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 5, p: 2 }}>
            <Typography variant='h5' component='h1' gutterBottom>
                Регистрация
            </Typography>
            {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <TextField label='Имя' value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth margin='normal' required />
            <TextField label='Фамилия' value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth margin='normal' required />
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
};

export default RegisterPage;
