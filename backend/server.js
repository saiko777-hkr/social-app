const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const storyRoutes = require('./routes/stories');
const chatRoutes = require('./routes/chat');
const followRoutes = require('./routes/follows');
const supportRoutes = require('./routes/support');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/support', supportRoutes);

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join private chat room
  socket.on('join_private_chat', (userId) => {
    socket.join(`private_${userId}`);
  });

  // Join group chat
  socket.on('join_group_chat', () => {
    socket.join('group_chat');
  });

  // Send private message
  socket.on('private_message', (data) => {
    socket.to(`private_${data.receiver_id}`).emit('private_message', data);
  });

  // Send group message
  socket.on('group_message', (data) => {
    io.to('group_chat').emit('group_message', data);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(`private_${data.receiver_id}`).emit('typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
