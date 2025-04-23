const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const forumRoutes = require('./routes/topics');
const adminRoutes = require('./routes/admin');
const commentRoutes = require('./routes/comments'); 

const app = express();

// CORS Configuration - Cho phép tất cả origin
app.use(cors()); // Bỏ corsOptions, cho phép tất cả origin

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', forumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
});

// MongoDB Atlas Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://namnguyendev:Namvuive123@studentmanagement.ng4uulh.mongodb.net/?retryWrites=true&w=majority&appName=studentmanagement';

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch((err) => {
    console.error('MongoDB Atlas connection error:', err);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được MongoDB
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
