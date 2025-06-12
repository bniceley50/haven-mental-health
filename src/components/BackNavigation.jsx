import React from 'react';
import { IconButton, Box, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable back navigation component
 * Provides consistent navigation experience across the app
 */
export function BackNavigation({ title, subtitle }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <IconButton 
        onClick={handleBack} 
        sx={{ mr: 2 }}
        aria-label="Go back"
      >
        <ArrowBack />
      </IconButton>
      <Box>
        {title && (
          <Typography variant="h5" component="h1">
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}