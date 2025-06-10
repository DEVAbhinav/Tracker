// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200EE', // A modern purple
    },
    secondary: {
      main: '#03DAC6', // A modern teal
    },
    background: {
      default: '#FFFFFF', // White background
      paper: '#F7F9FC',   // A very light grey for cards/paper elements
    },
    text: {
      primary: '#1A1A1A', // Dark grey for text
      secondary: '#6E7687',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
        fontWeight: 600,
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1A1A1A',
          boxShadow: 'none',
          borderBottom: '1px solid #E0E0E0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
            '&:hover': {
                boxShadow: 'none',
            }
        }
      },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            }
        }
    }
  },
});

export default theme;