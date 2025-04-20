const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Comment = require('../models/Comment');

// Lấy danh sách chủ đề (có phân trang)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Trang và giới hạn phải lớn hơn 0.' });
    }

    const totalTopics = await Topic.countDocuments();
    const topics = await Topic.find()
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'posts.comments',
        populate: { path: 'replies' },
      });

    res.json({
      topics,
      currentPage: page,
      totalPages: Math.ceil(totalTopics / limit),
      totalTopics,
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Không thể tải danh sách chủ đề.', error: error.message });
  }
});

// Lấy chi tiết một chủ đề
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate({
      path: 'posts.comments',
      populate: { path: 'replies' },
    });
    if (!topic) {
      return res.status(404).json({ message: 'Chủ đề không tồn tại.' });
    }
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ message: 'Không thể tải chi tiết chủ đề.', error: error.message });
  }
});

// Tạo chủ đề mới
router.post('/', async (req, res) => {
  try {
    const { title, description, user } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!title || !description || !user) {
      return res.status(400).json({ message: 'Tiêu đề, mô tả và thông tin người dùng là bắt buộc.' });
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(user);
    } catch (err) {
      return res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ.' });
    }

    if (!parsedUser.id || !parsedUser.name) {
      return res.status(400).json({ message: 'Thông tin người dùng không đầy đủ.' });
    }

    const newTopic = new Topic({
      title,
      description,
      author: { id: parsedUser.id, name: parsedUser.name, role: parsedUser.role || 'student' },
      createdAt: new Date(),
      posts: [],
    });

    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ message: 'Không thể tạo chủ đề.', error: error.message });
  }
});

// Sửa chủ đề
router.put('/:id', async (req, res) => {
  try {
    const { title, description, user } = req.body;
    let parsedUser;
    try {
      parsedUser = JSON.parse(user);
    } catch (err) {
      return res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ.' });
    }

    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Chủ đề không tồn tại.' });
    }

    // Chỉ tác giả hoặc admin được sửa
    if (topic.author.id.toString() !== parsedUser.id && parsedUser.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền sửa chủ đề này.' });
    }

    topic.title = title || topic.title;
    topic.description = description || topic.description;
    await topic.save();
    res.json(topic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ message: 'Không thể sửa chủ đề.', error: error.message });
  }
});

// Xóa chủ đề
router.delete('/:id', async (req, res) => {
  try {
    const { user } = req.body;
    let parsedUser;
    try {
      parsedUser = JSON.parse(user);
    } catch (err) {
      return res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ.' });
    }

    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Chủ đề không tồn tại.' });
    }

    // Chỉ tác giả hoặc admin được xóa
    if (topic.author.id.toString() !== parsedUser.id && parsedUser.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa chủ đề này.' });
    }

    await Topic.deleteOne({ _id: req.params.id });
    res.json({ message: 'Xóa chủ đề thành công.' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ message: 'Không thể xóa chủ đề.', error: error.message });
  }
});

// Tạo bài viết trong chủ đề
router.post('/:topicId/posts', async (req, res) => {
  try {
    const { title, content, user } = req.body;
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Chủ đề không tồn tại.' });
    }

    const newPost = {
      title,
      content,
      author: { id: user.id, name: user.name, role: user.role || 'student' },
      createdAt: new Date(),
    };
    topic.posts.push(newPost);
    await topic.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Không thể tạo bài viết.', error: error.message });
  }
});

// Tăng lượt xem bài viết
router.post('/:topicId/posts/:postId/view', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Chủ đề không tồn tại.' });
    }

    const post = topic.posts.id(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại.' });
    }

    post.views = (post.views || 0) + 1;
    await topic.save();
    res.json(post);
  } catch (error) {
    console.error('Error incrementing view:', error);
    res.status(500).json({ message: 'Không thể tăng lượt xem.', error: error.message });
  }
});

// Thêm bình luận
router.post('/comments', async (req, res) => {
  try {
    const { content, topicId, postId, parentCommentId, user } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!content || !topicId || !postId || !user) {
      return res.status(400).json({ message: 'Nội dung, topicId, postId và thông tin người dùng là bắt buộc.' });
    }

    if (!mongoose.Types.ObjectId.isValid(topicId) || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'topicId hoặc postId không hợp lệ.' });
    }

    if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
      return res.status(400).json({ message: 'parentCommentId không hợp lệ.' });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Chủ đề không tồn tại.' });
    }

    const post = topic.posts.id(postId);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại.' });
    }

    const newComment = new Comment({
      content,
      post: postId,
      author: { id: user.id, name: user.name, role: user.role || 'student' },
      parentComment: parentCommentId || null,
      createdAt: new Date(),
      replies: [],
    });

    await newComment.save();

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Bình luận cha không tồn tại.' });
      }
      parentComment.replies.push(newComment._id);
      await parentComment.save();
    } else {
      post.comments.push(newComment._id);
      await topic.save();
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Không thể thêm bình luận.', error: error.message });
  }
});

// Sửa bình luận
router.put('/comments/:id', async (req, res) => {
  try {
    const { content, user } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tồn tại.' });
    }

    // Chỉ tác giả được sửa bình luận của mình
    if (comment.author.id.toString() !== user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa bình luận này.' });
    }

    comment.content = content || comment.content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Không thể sửa bình luận.', error: error.message });
  }
});

// Xóa bình luận
router.delete('/comments/:id', async (req, res) => {
  try {
    const { user } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tồn tại.' });
    }

    // Quyền xóa bình luận:
    // - Admin có thể xóa mọi bình luận
    // - Sinh viên chỉ có thể xóa bình luận của mình
    // - Sinh viên không thể xóa bình luận của admin
    if (user.role !== 'admin' && comment.author.id.toString() !== user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này.' });
    }

    if (user.role === 'student' && comment.author.role === 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận của admin.' });
    }

    // Xóa comment và các replies liên quan
    await Comment.deleteMany({ _id: { $in: comment.replies } });
    await Comment.deleteOne({ _id: req.params.id });

    // Xóa tham chiếu trong post hoặc parent comment
    const topic = await Topic.findOne({ 'posts.comments': req.params.id });
    if (topic) {
      const post = topic.posts.find((p) => p.comments.includes(req.params.id));
      if (post) {
        post.comments = post.comments.filter((c) => c.toString() !== req.params.id);
        await topic.save();
      }
    }

    const parentComment = await Comment.findOne({ replies: req.params.id });
    if (parentComment) {
      parentComment.replies = parentComment.replies.filter((r) => r.toString() !== req.params.id);
      await parentComment.save();
    }

    res.json({ message: 'Xóa bình luận thành công.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Không thể xóa bình luận.', error: error.message });
  }
});

module.exports = router;