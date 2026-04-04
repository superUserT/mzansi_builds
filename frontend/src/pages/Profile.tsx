// frontend/src/pages/Profile.tsx
import  { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Avatar, Button, Grid, Card, CardContent, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { projectsApi } from '../api/projectsApi';
import type { CreateProjectPayload } from '../api/projectsApi';

const STAGES = ['Ideation', 'Prototyping', 'MVP', 'Scaling'];

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [projects, setProjects] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newProject, setNewProject] = useState<CreateProjectPayload>({
    title: '',
    description: '',
    stage: 'Ideation',
    supportRequired: [],
  });
  const [supportInput, setSupportInput] = useState('');

  const loadProjects = async () => {
    try {
      const allProjects = await projectsApi.getProjects();
      const myProjects = allProjects.filter((p: any) => p.user?.id === user?.id);
      setProjects(myProjects);
    } catch (error) {
      console.error('Failed to load projects', error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const handleCreateProject = async () => {
    setLoading(true);
    try {
      await projectsApi.createProject(newProject);
      setOpenModal(false);
      setNewProject({ title: '', description: '', stage: 'Ideation', supportRequired: [] });
      loadProjects(); 
    } catch (error) {
      console.error('Failed to create project', error);
    } finally {
      setLoading(false);
    }
  };

  const addSupportRequirement = () => {
    if (supportInput.trim() && !newProject.supportRequired?.includes(supportInput.trim())) {
      setNewProject({
        ...newProject,
        supportRequired: [...(newProject.supportRequired || []), supportInput.trim()]
      });
      setSupportInput('');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* --- User Header Section --- */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <Box flexGrow={1}>
          <Typography variant="h4" fontWeight="bold">{user?.username}</Typography>
          <Typography variant="body1" color="textSecondary">{user?.email}</Typography>
        </Box>
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          New Project
        </Button>
      </Paper>

      {/* --- Projects Grid --- */}
      <Typography variant="h5" fontWeight="bold" mb={3}>My Active Projects</Typography>
      <Grid container spacing={3}>
        {projects.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Typography color="textSecondary">You haven't created any projects yet. Start building!</Typography>
          </Grid>
        ) : (
          projects.map((project) => (
            <Grid size={{ xs: 12, md: 6 }} key={project.id}>
              <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" fontWeight="bold">{project.title}</Typography>
                    <Chip label={project.stage} color="primary" size="small" />
                  </Box>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {project.description}
                  </Typography>
                  
                  {project.supportRequired && project.supportRequired.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="caption" fontWeight="bold">Seeking Help With:</Typography>
                      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                        {project.supportRequired.map((req: string, idx: number) => (
                          <Chip key={idx} label={req} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* --- Create Project Modal --- */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Launch a New Project</DialogTitle>
        <DialogContent dividers>
          <TextField 
            fullWidth label="Project Title" margin="normal" required
            value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})}
          />
          <TextField 
            fullWidth label="Description" margin="normal" required multiline rows={3}
            value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          />
          <TextField 
            select fullWidth label="Current Stage" margin="normal"
            value={newProject.stage} onChange={(e) => setNewProject({...newProject, stage: e.target.value as any})}
          >
            {STAGES.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          
          <Box display="flex" gap={1} alignItems="center" mt={2}>
            <TextField 
              fullWidth label="Support Required (e.g., UI/UX, QA)" size="small"
              value={supportInput} onChange={(e) => setSupportInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSupportRequirement())}
            />
            <Button variant="outlined" onClick={addSupportRequirement}>Add</Button>
          </Box>
          <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
            {newProject.supportRequired?.map((req, idx) => (
              <Chip 
                key={idx} label={req} size="small" 
                onDelete={() => setNewProject({
                  ...newProject, 
                  supportRequired: newProject.supportRequired?.filter((_, i) => i !== idx)
                })} 
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained" color="primary" disabled={loading || !newProject.title}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}