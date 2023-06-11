import { extendTheme } from '@chakra-ui/react';

export const theme = {
  palette: {
    black: '#000000',
    primary: '#EA7000',
    primaryTint: '#EBA800',
    secondary: '#E8E8E8',
    secondaryTint: '#C4C4C4',
    textLight: '#575757',
    white: '#FFFFFF',
    lightGray: '#D7D7D7',
  },
} as const;

export const chakraTheme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        borderRadius: '50px',
        fontWeight: 'normal',
        fontSize: '1.2rem',
        textTransform: 'none',
        cursor: 'pointer',
        outline: 'none',
        border: '0',
        padding: '10px',
        _focus: {
          outline: 'none',
        },
      },
      variants: {
        popup: {
          padding: '1.8rem',
          fontWeight: 'semibold',
          fontSize: '1.5rem',
          bg: `linear-gradient(180deg, ${theme.palette.primary} 0%, ${theme.palette.primaryTint} 75%)`,
          color: 'white',
          _hover: {
            bg: `linear-gradient(180deg, ${theme.palette.primary} 0%, ${theme.palette.primaryTint} 75%)`,
          },
        },
        stoneGrey: {
          color: theme.palette.textLight,
          fontSize: '0.875rem',
          bg: `linear-gradient(180deg, ${theme.palette.secondary}, ${theme.palette.secondaryTint} 75%)`,
          _hover: {
            bg: `linear-gradient(180deg, ${theme.palette.primary} 0%, ${theme.palette.primaryTint} 75%)`,
            transform: 'scale(0.98)',
          },
          _focus: {
            boxShadow:
              '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)',
            transform: 'scale(0.98)',
            border: 'none',
          },
        },
        halfPrimary: {
          color: 'white',
          fontSize: '0.875rem',
          bg: `linear-gradient(180deg, ${theme.palette.primary} 0%, ${theme.palette.primaryTint} 75%)`,
          _hover: {
            bg: `linear-gradient(180deg, ${theme.palette.primary} 0%, ${theme.palette.primaryTint} 75%)`,
            transform: 'scale(0.98)',
          },
          _focus: {
            boxShadow:
              '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)',
            transform: 'scale(0.98)',
            border: 'none',
          },
        },
        primary: {
          color: 'white',
          bg: `linear-gradient(180deg, ${theme.palette.primary} 0%, ${theme.palette.primaryTint} 75%)`,
          _hover: {
            bg: `linear-gradient(180deg, ${theme.palette.primary} 0%, ${theme.palette.primaryTint} 75%)`,
          },
        },
        secondary: {
          color: theme.palette.textLight,
          bg: `linear-gradient(180deg, ${theme.palette.secondary} 0%, ${theme.palette.secondaryTint} 75%)`,
          _hover: {
            bg: `linear-gradient(180deg, ${theme.palette.secondary} 0%, ${theme.palette.secondaryTint} 75%)`,
          },
        },
      },
    },
  },
  colors: {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    textLight: theme.palette.textLight,
    white: theme.palette.white,
    lightGray: theme.palette.lightGray,
  },
  fonts: {
    heading: 'Quicksand, sans-serif',
    body: 'Quicksand, sans-serif',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '2.5rem',
    '4xl': '3rem',
    '5xl': '4rem',
    '6xl': '5rem',
  },
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
});

export type Theme = typeof theme;
