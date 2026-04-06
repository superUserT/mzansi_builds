import { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  TextField,
  IconButton,
  Skeleton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { usersApi } from "../api/usersApi";
import type { RootState } from "../store";

interface User {
  id: string;
  username: string;
  profilePictureUrl?: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: User;
  receiver: User;
}

interface Conversation {
  contact: User;
  thread: Message[];
}

export default function Messages() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeContact, setActiveContact] = useState<User | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    try {
      const data = await usersApi.getMessages();
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages", error);
      toast.error("Could not load inbox");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  // --- Data Processing ---
  // Explicitly typing the accumulator 'acc' and the current value 'msg'
  const conversations = messages.reduce(
    (acc, msg: Message) => {
      const isSender = msg.sender.id === currentUser?.id;
      const contact = isSender ? msg.receiver : msg.sender;

      if (!acc[contact.id]) {
        acc[contact.id] = { contact, thread: [] };
      }
      acc[contact.id].thread.push(msg);
      return acc;
    },
    {} as Record<string, Conversation>,
  );

  // contactList is now correctly inferred as Conversation[]
  const contactList = Object.values(conversations);

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeContact) return;
    setSending(true);

    try {
      await usersApi.sendMessage({
        receiverId: activeContact.id,
        content: replyText,
      });

      setReplyText("");
      await loadMessages();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 8, height: "calc(100vh - 160px)" }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Inbox
      </Typography>

      <Paper
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          borderRadius: 3,
          border: "1px solid #27272A",
          overflow: "hidden",
        }}
      >
        {/* --- Left Sidebar --- */}
        <Box
          sx={{
            width: { xs: "100%", md: "350px" },
            borderRight: "1px solid #27272A",
            display: { xs: activeContact ? "none" : "block", md: "block" },
            bgcolor: "background.paper",
          }}
        >
          <List sx={{ p: 0 }}>
            {loading ? (
              Array.from(new Array(4)).map((_, i) => (
                <Box key={i} p={2} borderBottom="1px solid #27272A">
                  <Box display="flex" gap={2}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
              ))
            ) : contactList.length === 0 ? (
              <Box p={4} textAlign="center">
                <Typography color="textSecondary">No messages yet.</Typography>
              </Box>
            ) : (
              contactList.map(({ contact, thread }: Conversation) => {
                const latestMessage = thread[thread.length - 1];
                const isActive = activeContact?.id === contact.id;

                return (
                  <Box key={contact.id}>
                    <ListItem
                      onClick={() => setActiveContact(contact)}
                      sx={{
                        cursor: "pointer",
                        bgcolor: isActive
                          ? "rgba(0, 163, 68, 0.1)"
                          : "transparent",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={contact.profilePictureUrl}
                          sx={{ bgcolor: "primary.main" }}
                        >
                          {contact.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography fontWeight={isActive ? "bold" : "normal"}>
                            {contact.username}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            noWrap
                          >
                            {latestMessage.sender.id === currentUser?.id
                              ? "You: "
                              : ""}
                            {latestMessage.content}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider sx={{ borderColor: "#27272A" }} />
                  </Box>
                );
              })
            )}
          </List>
        </Box>

        {/* --- Right Main Area --- */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: activeContact ? "flex" : "none", md: "flex" },
            flexDirection: "column",
            bgcolor: "background.default",
          }}
        >
          {activeContact ? (
            <>
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid #27272A",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  bgcolor: "background.paper",
                }}
              >
                <Button
                  sx={{ display: { md: "none" } }}
                  onClick={() => setActiveContact(null)}
                >
                  Back
                </Button>
                <Avatar
                  src={activeContact.profilePictureUrl}
                  sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                >
                  {activeContact.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {activeContact.username}
                </Typography>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {conversations[activeContact.id]?.thread.map((msg: Message) => {
                  const isMine = msg.sender.id === currentUser?.id;
                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        display: "flex",
                        justifyContent: isMine ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "70%",
                          p: 2,
                          borderRadius: 2,
                          bgcolor: isMine ? "primary.main" : "#27272A",
                          color: "white",
                          borderTopRightRadius: isMine ? 1 : 2,
                          borderTopLeftRadius: !isMine ? 1 : 2,
                        }}
                      >
                        <Typography variant="body1">{msg.content}</Typography>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid #27272A",
                  bgcolor: "background.paper",
                }}
              >
                <Box display="flex" gap={1} alignItems="flex-end">
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    variant="outlined"
                    size="small"
                    multiline
                    maxRows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />
                  <IconButton
                    color="primary"
                    disabled={!replyText.trim() || sending}
                    onClick={handleSendReply}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="textSecondary">
                Select a conversation to start chatting
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
