import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // This flips the entire app into Dark Mode
    primary: {
      main: '#00A344', // A slightly brighter Mzansi Green for better dark mode contrast
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#27272A', // A soft dark gray for secondary buttons
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#09090B', // Very deep, premium black/gray for the main background
      paper: '#18181B', // Slightly lighter gray for cards and modals
    },
    text: {
      primary: '#FAFAFA',
      secondary: '#A1A1AA',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', // 'Inter' is very modern
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.5px' },
  },
  shape: {
    borderRadius: 12, // Rounder corners for a modern feel
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(24, 24, 27, 0.8)', // Glassmorphism effect
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #27272A',
          boxShadow: 'none',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #27272A',
          backgroundImage: 'none', // Removes MUI's default dark mode overlay
        }
      }
    }
  }
});

export default theme;