import { Typography, SxProps } from '@mui/material';
import React, { ReactNode } from 'react';

interface ErrorTextProps {
    children: ReactNode;
    sx?: SxProps;
}

const ErrorText: React.FC<ErrorTextProps> = ({ children, sx = {} }) => {
    return (
        <Typography color='error' variant='h6' sx={{ textAlign: 'center', mt: 4, ...sx }}>
            {children}
        </Typography>
    );
};

export default ErrorText;
