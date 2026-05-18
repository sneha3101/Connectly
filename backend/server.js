require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/db');
const path = require('path');

// Initialize database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/chats', chatRoutes);

// Socket.io events
const User = require('./models/User');
const Message = require('./models/Message');
const { generateSmartReplies } = require('./utils/moderationUtils');

const userSockets = new Map(); // Map userId to socket ID

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User comes online
  socket.on('userOnline', async (userId) => {
    userSockets.set(userId, socket.id);
    await User.findByIdAndUpdate(userId, { isOnline: true });
    io.emit('userStatusChanged', { userId, isOnline: true });
    console.log(`User ${userId} is online`);
  });

  // Send message
  socket.on('sendMessage', async (data) => {
    const { chatId, senderId, receiverId, messageText, messageType, audioUrl, audioMimeType, audioDuration } = data;
    
    // Emit message to receiver
    const receiverSocketId = userSockets.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        chatId,
        senderId: { _id: senderId },
        _id: data._id,
        messageType,
        messageText,
        audioUrl,
        audioMimeType,
        audioDuration,
        createdAt: new Date(),
      });
    }

    // Generate smart replies
    if (!messageType || messageType === 'text') {
      const smartReplies = generateSmartReplies(messageText);
      socket.emit('smartReplySuggestions', { smartReplies });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { receiverId, senderId } = data;
    const receiverSocketId = userSockets.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userTyping', { senderId });
    }
  });

  // Stop typing
  socket.on('stopTyping', (data) => {
    const { receiverId, senderId } = data;
    const receiverSocketId = userSockets.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userStoppedTyping', { senderId });
    }
  });

  // Message seen
  socket.on('messageSeen', async (data) => {
    const { messageId, chatId, receiverId } = data;
    await Message.findByIdAndUpdate(messageId, { messageStatus: 'seen' });
    
    const receiverSocketId = userSockets.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('messageSeen', { messageId });
    }
  });

  // User goes offline
  socket.on('userOffline', async (userId) => {
    userSockets.delete(userId);
    await User.findByIdAndUpdate(userId, { isOnline: false });
    io.emit('userStatusChanged', { userId, isOnline: false });
    console.log(`User ${userId} is offline`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Find and remove user from online list
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        User.findByIdAndUpdate(userId, { isOnline: false }).catch(err => console.error(err));
        io.emit('userStatusChanged', { userId, isOnline: false });
        break;
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
