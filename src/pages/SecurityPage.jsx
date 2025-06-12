import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Lock,
  Security,
  VerifiedUser,
  CloudOff,
  Visibility,
  Timer,
  NoEncryption,
  Shield
} from '@mui/icons-material';
import { BackNavigation } from '../components/BackNavigation';

/**
 * Security Page
 * Explains our security measures to build therapist trust
 */
export function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock />,
      title: '256-bit AES Encryption',
      description: 'All patient data is encrypted using bank-level AES-256 encryption, the same standard used by financial institutions.'
    },
    {
      icon: <Security />,
      title: 'End-to-End Encryption',
      description: 'Messages are encrypted on your device and can only be decrypted by the intended recipient. Not even we can read them.'
    },
    {
      icon: <VerifiedUser />,
      title: 'HIPAA Compliant',
      description: 'Our platform meets all HIPAA requirements for protecting patient health information (PHI).'
    },
    {
      icon: <CloudOff />,
      title: 'Zero-Knowledge Architecture',
      description: 'We never have access to your encryption keys. Your data remains private, even from us.'
    },
    {
      icon: <Visibility />,
      title: 'Access Logs & Audit Trails',
      description: 'Every access to patient data is logged for compliance and security monitoring.'
    },
    {
      icon: <Timer />,
      title: 'Automatic Session Timeout',
      description: 'Sessions automatically expire after 8 hours of inactivity to prevent unauthorized access.'
    },
    {
      icon: <Shield />,
      title: 'TLS 1.3 Transport Security',
      description: 'All data in transit is protected with the latest TLS 1.3 protocol.'
    },
    {
      icon: <NoEncryption />,
      title: 'No Third-Party Access',
      description: 'We never share, sell, or allow third-party access to your patient data.'
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <BackNavigation title="Security & Privacy" />

      <Paper sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Your Security is Our Top Priority
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Haven Mental Health is built from the ground up with security and privacy at its core. 
          We understand the sensitivity of mental health data and have implemented multiple layers 
          of protection to ensure your patients' information remains completely confidential.
        </Typography>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Security Features
      </Typography>

      <List>
        {securityFeatures.map((feature, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemIcon sx={{ color: 'success.main', mt: 1 }}>
                {feature.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={500}>
                    {feature.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                }
              />
            </ListItem>
            {index < securityFeatures.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>

      <Paper sx={{ p: 3, mt: 4, bgcolor: 'success.light' }}>
        <Typography variant="h6" gutterBottom>
          HIPAA Compliance Checklist
        </Typography>
        <List dense>
          <ListItem>✓ Encrypted data at rest and in transit</ListItem>
          <ListItem>✓ Access controls and authentication</ListItem>
          <ListItem>✓ Audit logs for all PHI access</ListItem>
          <ListItem>✓ Business Associate Agreement (BAA) available</ListItem>
          <ListItem>✓ Regular security assessments</ListItem>
          <ListItem>✓ Incident response procedures</ListItem>
          <ListItem>✓ Employee HIPAA training</ListItem>
          <ListItem>✓ Physical security measures</ListItem>
        </List>
      </Paper>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
          Questions about security?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We're happy to discuss our security measures in detail. Contact us at{' '}
          <a href="mailto:security@haven-mental.health">security@haven-mental.health</a>
        </Typography>
      </Box>
    </Container>
  );
}