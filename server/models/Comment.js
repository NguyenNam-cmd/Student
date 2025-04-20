const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  author: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model('Comment', commentSchema);