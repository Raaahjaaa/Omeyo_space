const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// In-memory storage
const chats = {}; // { chatId: { users: [user1, user2], messages: [{ sender, text, timestamp }] } }

// Start a chat between two users
app.post('/chat/start', (req, res) => {
  const { user1, user2 } = req.body;
  if (!user1 || !user2) {
    return res.status(400).json({ error: 'Both user1 and user2 are required.' });
  }
  // Check if chat already exists
  let chatId = Object.keys(chats).find(
    id => {
      const users = chats[id].users;
      return (
        (users[0] === user1 && users[1] === user2) ||
        (users[0] === user2 && users[1] === user1)
      );
    }
  );
  if (!chatId) {
    chatId = uuidv4();
    chats[chatId] = { users: [user1, user2], messages: [] };
  }
  res.json({ chatId });
});

// Send a message
app.post('/chat/:chatId/message', (req, res) => {
  const { chatId } = req.params;
  const { sender, text } = req.body;
  if (!chats[chatId]) {
    return res.status(404).json({ error: 'Chat not found.' });
  }
  if (!sender || !text) {
    return res.status(400).json({ error: 'Sender and text are required.' });
  }
  const message = { sender, text, timestamp: new Date().toISOString() };
  chats[chatId].messages.push(message);
  res.json({ success: true, message });
});

// Get chat history
app.get('/chat/:chatId/messages', (req, res) => {
  const { chatId } = req.params;
  if (!chats[chatId]) {
    return res.status(404).json({ error: 'Chat not found.' });
  }
  res.json({ messages: chats[chatId].messages });
});

app.listen(PORT, () => {
  console.log(`Chat API server 2 running on http://localhost:${PORT}`);
}); 