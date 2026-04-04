import { Box, Typography, Container } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', borderTop: '1px solid #27272A', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          © {new Date().getFullYear()} Mzansi Builds. Built by developers, for developers.
        </Typography>
      </Container>
    </Box>
  );
}