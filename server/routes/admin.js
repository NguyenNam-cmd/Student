const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

router.post('/add-student', async (req, res) => {
  const { name, email, studentId, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Sinh viên đã tồn tại!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, studentId, password: hashedPassword, role: 'student' });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

router.put('/update-student/:id', async (req, res) => {
  const { name, email, studentId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, studentId },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

router.delete('/delete-student/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });

    res.json({ message: 'Đã xóa sinh viên!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;