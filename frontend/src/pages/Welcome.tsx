import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CodeIcon from '@mui/icons-material/Code';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import type { RootState } from '../store';

export default function Welcome() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Optional: A subtle glowing background effect */}
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw',
          height: '60vw',
          bgcolor: 'primary.main',
          opacity: 0.05,
          filter: 'blur(100px)',
          borderRadius: '50%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <CodeIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        
        <Typography 
          variant="h2" 
          fontWeight="900" 
          gutterBottom
          sx={{ 
            background: 'linear-gradient(45deg, #00A344 30%, #4ADE80 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}
        >
          Mzansi Builds
        </Typography>

        <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4, lineHeight: 1.6 }}>
          The premier platform for developers to build in public. 
          Share your milestones, collaborate with a vibrant community, and immortalize your finished projects on the Celebration Wall.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
          <Button 
            component={Link} 
            to="/register" 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<RocketLaunchIcon />}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 8 }}
          >
            Start Building
          </Button>
          <Button 
            component={Link} 
            to="/login" 
            variant="outlined" 
            color="inherit" 
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 8, borderColor: '#27272A' }}
          >
            Sign In
          </Button>
        </Box>

        {/* Feature Highlights */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 10, flexWrap: 'wrap' }}>
          {[
            { title: 'Live Feed', desc: 'Real-time project updates' },
            { title: 'Collaboration', desc: 'Find your next co-founder' },
            { title: 'Wall of Fame', desc: 'Showcase your shipped apps' },
          ].map((feature, idx) => (
            <Paper 
              key={idx} 
              elevation={0} 
              sx={{ 
                p: 3, 
                bgcolor: 'background.paper', 
                border: '1px solid #27272A',
                borderRadius: 4,
                minWidth: 200
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="primary.main">{feature.title}</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>{feature.desc}</Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}