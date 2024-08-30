import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface TypographyVariants {
        actayWide: React.CSSProperties;
    }

    interface TypographyVariantsOptions {
        actayWide?: React.CSSProperties;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        actayWide: true;
    }
}

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#C4F230',
            contrastText: '#111111',
        },
        secondary: {
            // main: '#FF407D',
            main: '#F59CF1',
            contrastText: '#ffffff',
        },
        error: {
            // main: '#E41749',
            main: '#FF2626',
        },
        background: {
            default: '#111111',
            paper: '#000000',
        },
        text: {
            primary: '#fff',
            secondary: '#c2c2c2',
        },
        info: {
            main: '#307ef2',
            contrastText: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Manrope',
        h1: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h2: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h3: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h4: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h5: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        h6: {
            fontFamily: 'ActayWide',
            fontWeight: 700,
        },
        button: {
            fontFamily: 'Manrope',
        },

        actayWide: {
            fontFamily: 'ActayWide',
        },
    },

    shape: {
        borderRadius: 8,
    },

    shadows: [
        'none',
        '0px 1px 3px rgba(255, 255, 255, 0.1), 0px 1px 1px rgba(255, 255, 255, 0.1), 0px 2px 1px -1px rgba(255, 255, 255, 0.1)',
        '0px 1px 5px rgba(255, 255, 255, 0.1), 0px 2px 2px rgba(255, 255, 255, 0.1), 0px 3px 1px -2px rgba(255, 255, 255, 0.1)',
        '0px 1px 8px rgba(255, 255, 255, 0.1), 0px 3px 4px rgba(255, 255, 255, 0.1), 0px 3px 3px -2px rgba(255, 255, 255, 0.1)',
        '0px 2px 4px -1px rgba(255, 255, 255, 0.1), 0px 4px 5px rgba(255, 255, 255, 0.1), 0px 1px 10px rgba(255, 255, 255, 0.1)',
        '0px 3px 5px -1px rgba(255, 255, 255, 0.1), 0px 5px 8px rgba(255, 255, 255, 0.1), 0px 1px 14px rgba(255, 255, 255, 0.1)',
        '0px 3px 5px -1px rgba(255, 255, 255, 0.1), 0px 6px 10px rgba(255, 255, 255, 0.1), 0px 1px 18px rgba(255, 255, 255, 0.1)',
        '0px 4px 5px -2px rgba(255, 255, 255, 0.1), 0px 7px 10px rgba(255, 255, 255, 0.1), 0px 2px 16px rgba(255, 255, 255, 0.1)',
        '0px 5px 5px -3px rgba(255, 255, 255, 0.1), 0px 8px 10px rgba(255, 255, 255, 0.1), 0px 3px 14px rgba(255, 255, 255, 0.1)',
        '0px 5px 6px -3px rgba(255, 255, 255, 0.1), 0px 9px 12px rgba(255, 255, 255, 0.1), 0px 3px 16px rgba(255, 255, 255, 0.1)',
        '0px 6px 6px -3px rgba(255, 255, 255, 0.1), 0px 10px 14px rgba(255, 255, 255, 0.1), 0px 4px 18px rgba(255, 255, 255, 0.1)',
        '0px 6px 7px -4px rgba(255, 255, 255, 0.1), 0px 11px 15px rgba(255, 255, 255, 0.1), 0px 4px 20px rgba(255, 255, 255, 0.1)',
        '0px 7px 8px -4px rgba(255, 255, 255, 0.1), 0px 12px 17px rgba(255, 255, 255, 0.1), 0px 5px 22px rgba(255, 255, 255, 0.1)',
        '0px 7px 8px -4px rgba(255, 255, 255, 0.1), 0px 13px 19px rgba(255, 255, 255, 0.1), 0px 5px 24px rgba(255, 255, 255, 0.1)',
        '0px 7px 9px -4px rgba(255, 255, 255, 0.1), 0px 14px 21px rgba(255, 255, 255, 0.1), 0px 5px 26px rgba(255, 255, 255, 0.1)',
        '0px 8px 9px -5px rgba(255, 255, 255, 0.1), 0px 15px 22px rgba(255, 255, 255, 0.1), 0px 6px 28px rgba(255, 255, 255, 0.1)',
        '0px 8px 10px -5px rgba(255, 255, 255, 0.1), 0px 16px 24px rgba(255, 255, 255, 0.1), 0px 6px 30px rgba(255, 255, 255, 0.1)',
        '0px 8px 11px -5px rgba(255, 255, 255, 0.1), 0px 17px 26px rgba(255, 255, 255, 0.1), 0px 6px 32px rgba(255, 255, 255, 0.1)',
        '0px 9px 11px -5px rgba(255, 255, 255, 0.1), 0px 18px 28px rgba(255, 255, 255, 0.1), 0px 7px 34px rgba(255, 255, 255, 0.1)',
        '0px 9px 12px -6px rgba(255, 255, 255, 0.1), 0px 19px 29px rgba(255, 255, 255, 0.1), 0px 7px 36px rgba(255, 255, 255, 0.1)',
        '0px 10px 13px -6px rgba(255, 255, 255, 0.1), 0px 20px 31px rgba(255, 255, 255, 0.1), 0px 8px 38px rgba(255, 255, 255, 0.1)',
        '0px 10px 13px -6px rgba(255, 255, 255, 0.1), 0px 21px 33px rgba(255, 255, 255, 0.1), 0px 8px 40px rgba(255, 255, 255, 0.1)',
        '0px 10px 14px -6px rgba(255, 255, 255, 0.1), 0px 22px 35px rgba(255, 255, 255, 0.1), 0px 8px 42px rgba(255, 255, 255, 0.1)',
        '0px 11px 14px -7px rgba(255, 255, 255, 0.1), 0px 23px 36px rgba(255, 255, 255, 0.1), 0px 9px 44px rgba(255, 255, 255, 0.1)',
        '0px 11px 15px -7px rgba(255, 255, 255, 0.1), 0px 24px 38px rgba(255, 255, 255, 0.1), 0px 9px 46px rgba(255, 255, 255, 0.1)',
    ],
});

theme.components = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: theme.shape.borderRadius,
                textTransform: 'none',
                '&.Mui-disabled': {},
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                background: 'none',
                backgroundColor: theme.palette.background.paper,
                boxShadow: 'none',
            },
        },
    },
};

export default theme;
