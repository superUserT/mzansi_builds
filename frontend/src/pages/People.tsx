import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, Avatar, Chip, IconButton, Button, Skeleton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField 
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { usersApi } from '../api/usersApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast'; // <-- Added toast
import type { RootState } from '../store';

export default function People() {
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // --- Message Modal State ---
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; username: string } | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const data = await usersApi.getAllUsers();
        const peers = data.filter((d: any) => d.id !== currentUser?.id);
        setDevelopers(peers);
      } catch (error) {
        console.error('Failed to load directory', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectory();
  }, [currentUser]);

  // --- Handlers ---
  const handleOpenMessage = (userId: string, username: string) => {
    setSelectedUser({ id: userId, username });
    setMessageContent('');
    setMessageModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !messageContent.trim()) return;
    setSending(true);
    const toastId = toast.loading(`Sending message to ${selectedUser.username}...`);

    try {
      await usersApi.sendMessage({
        receiverId: selectedUser.id,
        content: messageContent,
      });
      toast.success('Message sent successfully!', { id: toastId });
      setMessageModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message', { id: toastId });
    } finally {
      setSending(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box mb={5}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Developer Directory
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Discover other builders in the Mzansi ecosystem. Find your next co-founder or collaborator.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3, bgcolor: 'background.paper' }} />
            </Grid>
          ))
        ) : developers.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Typography color="textSecondary" textAlign="center">
              The directory is currently empty.
            </Typography>
          </Grid>
        ) : (
          developers.map((dev) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={dev.id}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 3, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: 'background.paper',
                  border: '1px solid #27272A',
                  transition: 'transform 0.2s, border-color 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.main' }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Avatar src={dev.profilePictureUrl} sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}>
                    {dev.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Typography variant="h6" fontWeight="bold">{dev.username}</Typography>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2, minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {dev.bio || 'This developer prefers to let their code do the talking.'}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mb: 3 }}>
                    {dev.skills && dev.skills.length > 0 ? (
                      dev.skills.slice(0, 3).map((skill: string, idx: number) => (
                        <Chip key={idx} label={skill} size="small" variant="outlined" sx={{ borderColor: '#3F3F46' }} />
                      ))
                    ) : (
                      <Chip label="Jack of all trades" size="small" variant="outlined" sx={{ borderColor: '#3F3F46', color: 'text.disabled' }} />
                    )}
                    {dev.skills && dev.skills.length > 3 && (
                      <Chip label={`+${dev.skills.length - 3}`} size="small" variant="outlined" sx={{ borderColor: '#3F3F46' }} />
                    )}
                  </Box>

                  <Box sx={{ mt: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      {dev.githubUrl && (
                        <IconButton size="small" href={dev.githubUrl} target="_blank" sx={{ color: 'text.secondary', '&:hover': { color: 'white' } }}>
                          <GitHubIcon fontSize="small" />
                        </IconButton>
                      )}
                      {dev.linkedInUrl && (
                        <IconButton size="small" href={dev.linkedInUrl} target="_blank" sx={{ color: 'text.secondary', '&:hover': { color: '#0A66C2' } }}>
                          <LinkedInIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="small" 
                      startIcon={<EmailIcon />}
                      sx={{ borderRadius: 6 }}
                      onClick={() => handleOpenMessage(dev.id, dev.username)} // <-- Wired up!
                    >
                      Message
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* --- Direct Message Modal --- */}
      <Dialog 
        open={messageModalOpen} 
        onClose={() => !sending && setMessageModalOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 3, border: '1px solid #27272A' } }}
      >
        <DialogTitle fontWeight="bold">
          Message @{selectedUser?.username}
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#27272A' }}>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Start a conversation about a project, ask for help, or explore collaboration.
          </Typography>
          <TextField 
            fullWidth 
            label="Your Message" 
            margin="normal" 
            multiline 
            rows={4} 
            value={messageContent} 
            onChange={(e) => setMessageContent(e.target.value)} 
            placeholder={`Hi ${selectedUser?.username}, I saw your work on...`}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMessageModalOpen(false)} color="inherit" disabled={sending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained" 
            color="primary" 
            disabled={!messageContent.trim() || sending}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}