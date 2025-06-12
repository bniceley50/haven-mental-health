import React from 'react';
import { Button, CircularProgress } from '@mui/material';

/**
 * Button with loading state
 * Provides visual feedback during async operations
 */
export function LoadingButton({ 
  loading, 
  children, 
  disabled, 
  onClick,
  ...props 
}) {
  return (
    <Button
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress size={16} sx={{ mr: 1 }} />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}