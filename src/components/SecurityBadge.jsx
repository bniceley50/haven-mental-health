import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Lock, VerifiedUser, Security } from '@mui/icons-material';

/**
 * Security Badge Component
 * Shows HIPAA compliance and encryption status
 * Builds trust with therapists
 */
export function SecurityBadge({ variant = 'default' }) {
  if (variant === 'compact') {
    return (
      <Chip
        icon={<Lock />}
        label="HIPAA Compliant • 256-bit Encryption"
        color="success"
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  }

  if (variant === 'inline') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Lock sx={{ fontSize: 16, color: 'success.main' }} />
        <Typography variant="caption" color="success.main" fontWeight={500}>
          Bank-level 256-bit AES Encryption
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'success.light',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      <Security sx={{ fontSize: 32, color: 'success.dark' }} />
      <Box>
        <Typography variant="subtitle1" fontWeight={600} color="success.dark">
          HIPAA Compliant Platform
        </Typography>
        <Typography variant="body2" color="success.dark">
          All data encrypted with 256-bit AES • TLS 1.3 • Zero-knowledge architecture
        </Typography>
      </Box>
    </Box>
  );
}