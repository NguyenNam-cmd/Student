const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Topic = require('./models/Topic');
const Comment = require('./models/Comment');

mongoose
  .connect('https://student-dun.vercel.app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Topic.deleteMany({});
    await Comment.deleteMany({});

    // Hash password for users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create users
    const users = await User.insertMany([
      {
        name: 'Nam Hoang',
        email: 'namhoang@gmail.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        name: 'Nguyen Dung',
        email: 'nd@gmail.com',
        password: hashedPassword,
        studentId: '2105555',
        academicYear: '2020',
        phone: '0222212261',
        role: 'student',
      },
      {
        name: 'Tuan Luu',
        email: 'tl@gmail.com',
        password: hashedPassword,
        studentId: '2108888',
        academicYear: '2021',
        phone: '0946555777',
        role: 'student',
      },
    ]);

    // Find users
    const namHoang = users.find((user) => user.email === 'namhoang@gmail.com');
    const nguyenDung = users.find((user) => user.email === 'nd@gmail.com');
    const tuanLuu = users.find((user) => user.email === 'tl@gmail.com');

    // Create topics with embedded posts
    const topics = await Topic.insertMany([
      {
        title: 'Giới thiệu về React',
        description: 'Tìm hiểu những kiến thức cơ bản về React để xây dựng các ứng dụng web hiện đại.',
        author: { id: nguyenDung._id, name: nguyenDung.name, role: nguyenDung.role },
        createdAt: new Date('2025-04-19'),
        posts: [
          {
            title: 'Bắt đầu với React Hooks',
            content: 'Giới thiệu về React Hooks và cách sử dụng chúng hiệu quả.',
            author: { id: nguyenDung._id, name: nguyenDung.name, role: nguyenDung.role },
            comments: [],
            views: 0,
            createdAt: new Date('2025-04-19'),
          },
          {
            title: 'Quản lý trạng thái bằng React',
            content: 'Các cách tiếp cận khác nhau để quản lý trạng thái trong ứng dụng React.',
            author: { id: tuanLuu._id, name: tuanLuu.name, role: tuanLuu.role },
            comments: [],
            views: 0,
            createdAt: new Date('2025-04-19'),
          },
        ],
      },
      {
        title: 'Thực hành tốt nhất của Node.js',
        description: 'Các phương pháp hay nhất để xây dựng ứng dụng Node.js có khả năng mở rộng.',
        author: { id: tuanLuu._id, name: tuanLuu.name, role: tuanLuu.role },
        createdAt: new Date('2025-04-19'),
        posts: [
          {
            title: 'Xử lý lỗi trong Node.js',
            content: 'Các biện pháp tốt nhất để xử lý lỗi trong ứng dụng Node.js.',
            author: { id: tuanLuu._id, name: tuanLuu.name, role: tuanLuu.role },
            comments: [],
            views: 0,
            createdAt: new Date('2025-04-19'),
          },
        ],
      },
      {
        title: 'MongoDB dành cho người mới bắt đầu',
        description: 'Hướng dẫn dành cho người mới bắt đầu sử dụng MongoDB với Node.js.',
        author: { id: namHoang._id, name: namHoang.name, role: namHoang.role },
        createdAt: new Date('2025-04-19'),
        posts: [],
      },
      {
        title: 'Tính năng của JavaScript ES6',
        description: 'Khám phá các tính năng mới được giới thiệu trong ES6.',
        author: { id: nguyenDung._id, name: nguyenDung.name, role: nguyenDung.role },
        createdAt: new Date('2025-04-19'),
        posts: [],
      },
      {
        title: 'CSS Grid so với Flexbox',
        description: 'So sánh CSS Grid và Flexbox trong thiết kế bố cục.',
        author: { id: tuanLuu._id, name: tuanLuu.name, role: tuanLuu.role },
        createdAt: new Date('2025-04-19'),
        posts: [],
      },
      {
        title: 'Thiết kế REST API',
        description: 'Các phương pháp hay nhất để thiết kế API RESTful.',
        author: { id: namHoang._id, name: namHoang.name, role: namHoang.role },
        createdAt: new Date('2025-04-19'),
        posts: [],
      },
      {
        title: 'Cơ bản về GraphQL',
        description: 'Giới thiệu về GraphQL và lợi ích của nó so với REST.',
        author: { id: nguyenDung._id, name: nguyenDung.name, role: nguyenDung.role },
        createdAt: new Date('2025-04-19'),
        posts: [],
      },
    ]);

    // Create comments for the first post in the first topic
    const firstTopic = topics[0];
    const firstPost = firstTopic.posts[0];

    const comments = await Comment.insertMany([
      {
        content: 'Bài viết tuyệt vời! Tôi đã học được rất nhiều về React Hooks.',
        postId: firstPost._id, // Sửa: sử dụng postId thay vì post
        topicId: firstTopic._id, // Thêm topicId
        author: { id: tuanLuu._id, name: tuanLuu.name, role: tuanLuu.role },
        createdAt: new Date('2025-04-19'),
        replies: [],
      },
      {
        content: 'Cảm ơn phản hồi của bạn! Thật vui vì bạn thấy nó hữu ích.',
        postId: firstPost._id, // Sửa: sử dụng postId thay vì post
        topicId: firstTopic._id, // Thêm topicId
        parentComment: null,
        author: { id: nguyenDung._id, name: nguyenDung.name, role: nguyenDung.role },
        createdAt: new Date('2025-04-19'),
        replies: [],
      },
      {
        content: 'Bạn có thể giải thích chi tiết hơn về useEffect không?',
        postId: firstPost._id, // Sửa: sử dụng postId thay vì post
        topicId: firstTopic._id, // Thêm topicId
        parentComment: null,
        author: { id: namHoang._id, name: namHoang.name, role: namHoang.role },
        createdAt: new Date('2025-04-19'),
        replies: [],
      },
    ]);

    // Create replies for the third comment
    const replies = await Comment.insertMany([
      {
        content: 'Chắc chắn, useEffect được sử dụng cho các hiệu ứng phụ trong React...',
        postId: firstPost._id, // Sửa: sử dụng postId thay vì post
        topicId: firstTopic._id, // Thêm topicId
        parentComment: comments[2]._id,
        author: { id: nguyenDung._id, name: nguyenDung.name, role: nguyenDung.role },
        createdAt: new Date('2025-04-19'),
        replies: [],
      },
    ]);

    // Update the third comment with the reply
    await Comment.findByIdAndUpdate(comments[2]._id, { replies: [replies[0]._id] });

    // Update the first post with comments
    firstTopic.posts[0].comments = [comments[0]._id, comments[1]._id, comments[2]._id];
    await firstTopic.save();

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();