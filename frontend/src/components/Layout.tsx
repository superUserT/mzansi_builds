import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast'; 
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Configure the Toaster for our Dark Mode theme */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#27272A', 
            color: '#FAFAFA',
            border: '1px solid #3F3F46',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#00A344',
              secondary: '#FAFAFA',
            },
          },
        }} 
      />

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet /> 
      </Box>
      <Footer />
    </Box>
  );
}