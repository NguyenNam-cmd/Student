const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const forumRoutes = require('./routes/topics');
const adminRoutes = require('./routes/admin');
const commentRoutes = require('./routes/comments'); 

const app = express();

// Middleware
app.use(cors()); // Chỉ cho phép frontend trên Vercel
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', forumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI) // Xóa các tùy chọn deprecated
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error('MongoDB Atlas connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));