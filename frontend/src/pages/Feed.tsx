import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Fade,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlagIcon from "@mui/icons-material/Flag";
import CommentIcon from "@mui/icons-material/Comment";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useFeedSocket } from "../hooks/useFeedSocket";
import type { FeedEvent } from "../hooks/useFeedSocket";

export default function Feed() {
  const { feedItems, isConnected } = useFeedSocket();
  const renderFeedContent = (event: FeedEvent) => {
    switch (event.type) {
      case "PROJECT_CREATED":
        return (
          <>
            <Chip
              icon={<RocketLaunchIcon />}
              label="New Project Launched"
              color="info"
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="body1">
              <strong>{event.data.username || "A builder"}</strong> has started
              a new project:
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 1, fontWeight: "bold" }}
            >
              {event.data.title}
            </Typography>
          </>
        );
      case "MILESTONE_ADDED":
        return (
          <>
            <Chip
              icon={<FlagIcon />}
              label="New Milestone"
              color="primary"
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="body1">
              <strong>{event.data.username || "A builder"}</strong> added a
              milestone:
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 1, fontStyle: "italic" }}
            >
              "{event.data.description}"
            </Typography>
          </>
        );
      case "COMMENT_ADDED":
        return (
          <>
            <Chip
              icon={<CommentIcon />}
              label="New Comment"
              color="secondary"
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="body1">
              <strong>{event.data.username || "Someone"}</strong> commented on a
              milestone!
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 1, fontStyle: "italic" }}
            >
              "{event.data.comment}"
            </Typography>
          </>
        );
      case "PROJECT_COMPLETED":
        return (
          <>
            <Chip
              icon={<CheckCircleIcon />}
              label="Project Completed!"
              color="success"
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="body1">
              <strong>{event.data.username || "A builder"}</strong> just
              completed their project: <strong>{event.data.title}</strong>!
            </Typography>
          </>
        );
      default:
        return <Typography>Unknown activity occurred.</Typography>;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
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
          <Typography variant="body2">
            Waiting for developers to post updates...
          </Typography>
        </Box>
      ) : (
        feedItems.map((event) => (
          <Fade in={true} key={event.id}>
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ display: "flex", gap: 2 }}>
                {/* Fixed Avatar to use the URL if available */}
                <Avatar
                  src={event.data.userProfilePictureUrl}
                  sx={{ bgcolor: "primary.main", border: "1px solid #27272A" }}
                >
                  {event.data.username
                    ? event.data.username.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>
                <Box flexGrow={1}>
                  {renderFeedContent(event)}
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 2, color: "text.disabled" }}
                  >
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
