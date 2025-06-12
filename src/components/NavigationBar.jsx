import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  Home,
  Message,
  Note,
  Schedule,
  Logout,
  Person,
  Lock
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/auth-context';

/**
 * Navigation Bar Component
 * Provides consistent navigation across the application
 */
export function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const navItems = [
    { path: '/', icon: <Home />, label: 'Dashboard' },
    { path: '/messages', icon: <Message />, label: 'Messages' },
    { path: '/note/new', icon: <Note />, label: 'Notes' },
    { path: '/schedule', icon: <Schedule />, label: 'Schedule' }
  ];

  // Don't show nav on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Haven Mental Health
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <IconButton
              key={item.path}
              onClick={() => navigate(item.path)}
              color={location.pathname === item.path ? 'primary' : 'default'}
              title={item.label}
            >
              {item.icon}
            </IconButton>
          ))}
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        <IconButton onClick={handleProfileClick}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.name?.charAt(0) || 'T'}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled>
            <Person sx={{ mr: 1 }} />
            {user?.name || 'Therapist'}
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { navigate('/security'); handleClose(); }}>
            <Lock sx={{ mr: 1 }} />
            Security & Privacy
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}