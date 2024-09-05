import React from 'react';
import { Alert, Paper, Theme, Typography } from '@mui/material';
import { useStore } from '@stores/StoreContext';
import { SxProps } from '@mui/system/styleFunctionSx';

interface FormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    title?: string;
    sx?: SxProps<Theme>;
    children: React.ReactNode;
}

const Form = ({ onSubmit, title, sx, children }: FormProps) => {
    const { authStore } = useStore();
    return (
        <Paper component='form' onSubmit={onSubmit} sx={{ maxWidth: 450, margin: 'auto', mt: 5, p: 5, ...sx }}>
            <Typography variant='h5' component='h1' gutterBottom>
                {title}
            </Typography>
            {authStore.hasErrors() && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    {authStore.getErrorMessages()}
                </Alert>
            )}
            {children}
        </Paper>
    );
};

export default Form;
