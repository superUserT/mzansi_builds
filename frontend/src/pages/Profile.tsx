import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Avatar, Button, Grid, Card, CardContent, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, CardActions, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { projectsApi} from '../api/projectsApi';
import type { CreateProjectPayload } from '../api/projectsApi';

const STAGES = ['Ideation', 'Prototyping', 'MVP', 'Scaling'];

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals State
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openMilestoneModal, setOpenMilestoneModal] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Forms State
  const [newProject, setNewProject] = useState<CreateProjectPayload>({
    title: '', description: '', stage: 'Ideation', supportRequired: [],
  });
  const [supportInput, setSupportInput] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');

  const loadProjects = async () => {
    try {
      const allProjects = await projectsApi.getProjects();
      const myProjects = allProjects.filter((p: any) => p.user?.id === user?.id);
      setProjects(myProjects);
    } catch (error) {
      console.error('Failed to load projects', error);
    }
  };

  useEffect(() => { loadProjects(); }, [user]);

  // Handlers
  const handleCreateProject = async () => {
    setLoading(true);
    try {
      await projectsApi.createProject(newProject);
      setOpenProjectModal(false);
      setNewProject({ title: '', description: '', stage: 'Ideation', supportRequired: [] });
      loadProjects();
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleAddMilestone = async () => {
    if (!activeProjectId || !milestoneDesc) return;
    setLoading(true);
    try {
      await projectsApi.addMilestone(activeProjectId, milestoneDesc);
      setOpenMilestoneModal(false);
      setMilestoneDesc('');
      loadProjects();
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleCompleteProject = async (projectId: string) => {
    if(!window.confirm("Are you sure you want to complete this project? It will be sent to the Celebration Wall!")) return;
    try {
      await projectsApi.completeProject(projectId);
      loadProjects();
    } catch (error) { console.error('Error:', error); }
  };

  const addSupportRequirement = () => {
    if (supportInput.trim() && !newProject.supportRequired?.includes(supportInput.trim())) {
      setNewProject({ ...newProject, supportRequired: [...(newProject.supportRequired || []), supportInput.trim()] });
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
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpenProjectModal(true)}>
          New Project
        </Button>
      </Paper>

      {/* --- Active Projects Grid --- */}
      <Typography variant="h5" fontWeight="bold" mb={3}>My Active Projects</Typography>
      <Grid container spacing={3}>
        {projects.filter(p => !p.isCompleted).length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Typography color="textSecondary">No active projects. Start building!</Typography>
          </Grid>
        ) : (
          projects.filter(p => !p.isCompleted).map((project) => (
            <Grid size={{ xs: 12, md: 6 }} key={project.id}>
              <Card elevation={2} sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" fontWeight="bold">{project.title}</Typography>
                    <Chip label={project.stage} color="primary" size="small" />
                  </Box>
                  <Typography variant="body2" color="textSecondary" paragraph>{project.description}</Typography>
                  
                  {project.supportRequired && project.supportRequired.length > 0 && (
                    <Box mt={2} mb={2}>
                      <Typography variant="caption" fontWeight="bold">Seeking Help With:</Typography>
                      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                        {project.supportRequired.map((req: string, idx: number) => (
                          <Chip key={idx} label={req} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>Milestones ({project.milestones?.length || 0})</Typography>
                  {project.milestones?.slice(-2).map((m: any) => (
                    <Typography key={m.id} variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', mb: 0.5 }}>
                      • {m.description}
                    </Typography>
                  ))}
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Button 
                    size="small" startIcon={<FlagIcon />} color="primary"
                    onClick={() => { setActiveProjectId(project.id); setOpenMilestoneModal(true); }}
                  >
                    Add Milestone
                  </Button>
                  <Button 
                    size="small" startIcon={<CheckCircleIcon />} color="success"
                    onClick={() => handleCompleteProject(project.id)}
                  >
                    Complete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* --- Create Project Modal --- */}
      <Dialog open={openProjectModal} onClose={() => setOpenProjectModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Launch a New Project</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth label="Project Title" margin="normal" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} />
          <TextField fullWidth label="Description" margin="normal" multiline rows={3} value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
          <TextField select fullWidth label="Current Stage" margin="normal" value={newProject.stage} onChange={(e) => setNewProject({...newProject, stage: e.target.value as any})}>
            {STAGES.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </TextField>
          
          <Box display="flex" gap={1} alignItems="center" mt={2}>
            <TextField 
              fullWidth label="Support Required (e.g., UI/UX, QA)" size="small"
              value={supportInput} onChange={(e) => setSupportInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSupportRequirement())}
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
          <Button onClick={() => setOpenProjectModal(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained" disabled={!newProject.title || loading}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* --- Add Milestone Modal --- */}
      <Dialog open={openMilestoneModal} onClose={() => setOpenMilestoneModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Log a Milestone</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="textSecondary" mb={2}>
            What did you accomplish? This will be broadcast to the live community feed!
          </Typography>
          <TextField fullWidth label="Milestone Description" margin="normal" multiline rows={2} value={milestoneDesc} onChange={(e) => setMilestoneDesc(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMilestoneModal(false)}>Cancel</Button>
          <Button onClick={handleAddMilestone} variant="contained" color="primary" disabled={!milestoneDesc || loading}>Post Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}