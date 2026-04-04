import  { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { projectsApi } from '../api/projectsApi';

export default function CelebrationWall() {
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);

  useEffect(() => {
    const loadWall = async () => {
      try {
        const data = await projectsApi.getCelebrationWall();
        setCompletedProjects(data);
      } catch (error) {
        console.error('Failed to load celebration wall', error);
      }
    };
    loadWall();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box textAlign="center" mb={6}>
        <EmojiEventsIcon sx={{ fontSize: 60, color: '#FFD700', mb: 2 }} />
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          The Celebration Wall
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Honoring the developers who built in public and shipped their ideas.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {completedProjects.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Typography textAlign="center" color="textSecondary">
              No projects have crossed the finish line yet. Will yours be the first?
            </Typography>
          </Grid>
        ) : (
          completedProjects.map((project) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
              <Card elevation={3} sx={{ borderRadius: 3, height: '100%', borderTop: '4px solid #007A33' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {project.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {project.user?.username}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Shipped {new Date(project.completedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {project.description}
                  </Typography>
                  <Chip 
                    label={`${project.milestones?.length || 0} Milestones Reached`} 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}