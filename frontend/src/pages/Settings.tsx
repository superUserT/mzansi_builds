import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, TextField, Button, Grid, Divider, FormControlLabel, Switch 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import type { RootState } from '../store';
import { setCredentials } from '../store/slices/authSlice';
import { usersApi } from '../api/usersApi';

export default function Settings() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  
  const [formData, setFormData] = useState({
    bio: '',
    githubUrl: '',
    linkedInUrl: '',
    skillsInput: '', 
    emailNotifications: true,
  });

  // Populate form when the component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        githubUrl: user.githubUrl || '',
        linkedInUrl: user.linkedInUrl || '',
        skillsInput: user.skills ? user.skills.join(', ') : '',
        emailNotifications: user.emailNotifications !== false, 
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const toastId = toast.loading('Saving profile settings...');

    try {
      const skillsArray = formData.skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const payload = {
        bio: formData.bio,
        githubUrl: formData.githubUrl,
        linkedInUrl: formData.linkedInUrl,
        emailNotifications: formData.emailNotifications,
        skills: skillsArray,
      };

      const updatedUser = await usersApi.updateProfile(payload);

      if (token) {
        dispatch(setCredentials({ user: updatedUser, accessToken: token }));
      }

      toast.success('Settings updated successfully!', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Account Settings
      </Typography>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #27272A', bgcolor: 'background.paper' }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>Developer Persona</Typography>
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell the community a bit about yourself..."
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="GitHub Profile URL"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="LinkedIn Profile URL"
              name="linkedInUrl"
              value={formData.linkedInUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Skills (Comma Separated)"
              name="skillsInput"
              value={formData.skillsInput}
              onChange={handleChange}
              placeholder="React, Node.js, Python, TypeScript"
              helperText="These skills will help others find you in the directory."
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#27272A' }} />
        
        <Typography variant="h6" fontWeight="bold" mb={2}>Preferences</Typography>
        
        <Box mb={4}>
          <FormControlLabel
            control={
              <Switch 
                checked={formData.emailNotifications} 
                onChange={handleChange} 
                name="emailNotifications" 
                color="primary" 
              />
            }
            label={
              <Box>
                <Typography variant="body1" fontWeight="bold">Email Notifications</Typography>
                <Typography variant="body2" color="textSecondary">
                  Receive emails when developers want to collaborate with you.
                </Typography>
              </Box>
            }
          />
        </Box>

        <Box display="flex" justifyContent="flex-end">
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />} 
            onClick={handleSave}
            disabled={loading}
            sx={{ px: 4, py: 1.5 }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}