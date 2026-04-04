import { Container, Typography, Box, Card, CardContent, Avatar, Chip, Fade } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlagIcon from '@mui/icons-material/Flag';
import CommentIcon from '@mui/icons-material/Comment';
import { useFeedSocket } from '../hooks/useFeedSocket';
import type { FeedEvent } from '../hooks/useFeedSocket';


export default function Feed() {
  const { feedItems, isConnected } = useFeedSocket();
  const renderFeedContent = (event: FeedEvent) => {
    switch (event.type) {
      case 'MILESTONE_ADDED':
        return (
          <>
            <Chip icon={<FlagIcon />} label="New Milestone" color="primary" size="small" sx={{ mb: 1 }} />
            <Typography variant="body1">
              <strong>User {event.data.userId.substring(0, 5)}</strong> added a milestone:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: 'italic' }}>
              "{event.data.description}"
            </Typography>
          </>
        );
      case 'COMMENT_ADDED':
        return (
          <>
            <Chip icon={<CommentIcon />} label="New Comment" color="secondary" size="small" sx={{ mb: 1 }} />
            <Typography variant="body1">
              Someone commented on a milestone!
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: 'italic' }}>
              "{event.data.comment}"
            </Typography>
          </>
        );
      case 'PROJECT_COMPLETED':
        return (
          <>
            <Chip icon={<CheckCircleIcon />} label="Project Completed!" color="success" size="small" sx={{ mb: 1 }} />
            <Typography variant="body1">
              <strong>{event.data.title}</strong> has just been completed!
            </Typography>
          </>
        );
      default:
        return <Typography>Unknown activity occurred.</Typography>;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Live Community Feed
        </Typography>
        <Chip 
          label={isConnected ? "Live" : "Connecting..."} 
          color={isConnected ? "success" : "default"} 
          variant={isConnected ? "filled" : "outlined"}
        />
      </Box>

      {feedItems.length === 0 ? (
        <Box textAlign="center" mt={10} color="text.secondary">
          <Typography variant="h6">The feed is quiet right now.</Typography>
          <Typography variant="body2">Waiting for developers to post updates...</Typography>
        </Box>
      ) : (
        feedItems.map((event) => (
          <Fade in={true} key={event.id}>
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {/* Just grabbing the first letter of the ID for now as a placeholder avatar */}
                  {event.data.userId ? event.data.userId.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Box flexGrow={1}>
                  {renderFeedContent(event)}
                  <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.disabled' }}>
                    {event.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        ))
      )}
    </Container>
  );
}