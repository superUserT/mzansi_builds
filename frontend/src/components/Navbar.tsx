import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login'); 
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {/* Logo / Brand Name */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit', 
            fontWeight: 'bold',
            letterSpacing: 1
          }}
        >
          Mzansi Builds
        </Typography>

        {/* Dynamic Navigation Links */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/feed">
                Feed
              </Button>
              <Button color="inherit" component={Link} to="/celebration-wall">
                Celebration Wall
              </Button>
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>
              <Button 
                color="secondary" 
                variant="contained" 
                onClick={handleLogout} 
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Sign In
              </Button>
              <Button 
                color="secondary" 
                variant="contained" 
                component={Link} 
                to="/register"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}