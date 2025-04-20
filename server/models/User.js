const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  studentId: { type: String, trim: true },
  academicYear: { type: String, trim: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['student', 'admin'], required: true },
});

module.exports = mongoose.model('User', userSchema);