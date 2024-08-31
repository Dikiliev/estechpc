import React from 'react';
import { Paper, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '@styles/theme';

interface Props {
    title: string;
    icon: string;
    buttons: {
        name: string;
        url: string;
    }[];
    // additionalBottomElements?: React.ReactNode[];
}

const BaseEmptyState: React.FC<Props> = ({ title, icon, buttons }) => {
    const navigate = useNavigate();

    return (
        <Container maxWidth='md' sx={{ py: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    padding: theme.spacing(6),
                    textAlign: 'center',
                    borderRadius: 2,
                    boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant='h6' sx={{ mb: 2 }}>
                    {title}
                </Typography>

                <Box component='img' src={icon} sx={{ width: '100px' }} py={4} />

                {buttons.map((button, index) => (
                    <Button
                        key={index}
                        variant='text'
                        color='primary'
                        sx={{ padding: theme.spacing(1, 4), fontWeight: 'bold' }}
                        onClick={() => navigate(button.url)}
                    >
                        {button.name}
                    </Button>
                ))}
            </Paper>
        </Container>
    );
};

export default BaseEmptyState;
