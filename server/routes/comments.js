const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Comment = require('../models/Comment');
const Topic = require('../models/Topic');
const authMiddleware = require('../middleware/auth');

// Tạo bình luận mới
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, topicId, postId, parentCommentId } = req.body;
    const user = req.user;

    if (!content || !topicId || !postId) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: content, topicId, hoặc postId.' });
    }

    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: 'topicId không hợp lệ.' });
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'postId không hợp lệ.' });
    }
    if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
      return res.status(400).json({ message: 'parentCommentId không hợp lệ.' });
    }

    console.log('Creating new comment with data:', { content, topicId, postId, parentCommentId, author: user });

    const newComment = new Comment({
      content,
      topicId,
      postId,
      parentCommentId,
      author: user,
    });

    await newComment.save();

    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: newComment._id },
      });
    }

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ message: 'Không thể tạo bình luận.', error: err.message });
  }
});

// Sửa bình luận
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tồn tại.' });
    }

    if (comment.author.id !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền sửa bình luận này.' });
    }

    comment.content = content;
    comment.updatedAt = Date.now();
    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ message: 'Không thể sửa bình luận.' });
  }
});

// Xóa bình luận
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tồn tại.' });
    }

    if (comment.author.id !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này.' });
    }

    if (comment.replies && comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    if (comment.parentCommentId) {
      await Comment.findByIdAndUpdate(comment.parentCommentId, {
        $pull: { replies: comment._id },
      });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa bình luận thành công.' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Không thể xóa bình luận.' });
  }
});

module.exports = router;