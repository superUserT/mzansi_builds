// frontend/src/components/Navbar.tsx
import  { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItem, Divider, Container } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import type { RootState } from '../store';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { label: 'Feed', path: '/feed' },
    { label: 'Wall of Fame', path: '/celebration-wall' },
    { label: 'My Projects', path: '/profile' },
    { label: 'People', path: '/people' },
    { label: 'Messages', path: '/messages' },
  ];

  if (!isAuthenticated) return null; 

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }} component={Link} to="/">
            <CodeIcon color="primary" fontSize="large" />
            <Typography variant="h6" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Mzansi Builds
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button 
                  key={item.label}
                  component={Link} 
                  to={item.path}
                  sx={{ 
                    color: isActive ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive ? 'bold' : 'normal',
                    borderBottom: isActive ? '2px solid' : '2px solid transparent',
                    borderRadius: 0,
                    px: 2,
                    '&:hover': { color: 'text.primary', borderBottom: '2px solid #00A344' }
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* User Avatar & Dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: 'primary.main', border: '2px solid #27272A' }}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { mt: 1, minWidth: 200, bgcolor: 'background.paper', border: '1px solid #27272A' } }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">{user?.username}</Typography>
                <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              </Box>
              <Divider sx={{ borderColor: '#27272A' }} />
              
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>
                <AccountCircleIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> My Profile
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}>
                <SettingsIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> Settings
              </MenuItem>
              
              <Divider sx={{ borderColor: '#27272A' }} />
              
              <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} /> Log Out
              </MenuItem>
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}