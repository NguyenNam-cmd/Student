const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Tiêu đề là bắt buộc'], 
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Mô tả là bắt buộc'], 
    trim: true 
  },
  author: {
    id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'Tác giả là bắt buộc'] 
    },
    name: { 
      type: String, 
      required: [true, 'Tên tác giả là bắt buộc'], 
      trim: true 
    },
    role: { 
      type: String, 
      enum: ['student', 'admin'], 
      default: 'student' 
    }
  },
  posts: [
    {
      title: { 
        type: String, 
        required: [true, 'Tiêu đề bài viết là bắt buộc'], 
        trim: true 
      },
      content: { 
        type: String, 
        required: [true, 'Nội dung bài viết là bắt buộc'], 
        trim: true 
      },
      author: {
        id: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User', 
          required: [true, 'Tác giả bài viết là bắt buộc'] 
        },
        name: { 
          type: String, 
          required: [true, 'Tên tác giả bài viết là bắt buộc'], 
          trim: true 
        },
        role: { 
          type: String, 
          enum: ['student', 'admin'], 
          default: 'student' 
        }
      },
      comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment', 
        default: [] 
      }],
      views: { 
        type: Number, 
        default: 0 
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      },
    },
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Topic', topicSchema);