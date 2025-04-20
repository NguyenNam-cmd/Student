const authMiddleware = (req, res, next) => {
  try {
    // Lấy thông tin người dùng từ request body
    const user = req.body.user;

    // Nếu không có thông tin người dùng, trả về lỗi 401
    if (!user) {
      return res.status(401).json({ message: 'Bạn cần đăng nhập để thực hiện hành động này.' });
    }

    // Parse thông tin người dùng (vì dữ liệu từ frontend gửi qua dưới dạng chuỗi JSON)
    const parsedUser = typeof user === 'string' ? JSON.parse(user) : user;

    // Kiểm tra xem thông tin người dùng có hợp lệ không
    if (!parsedUser.id || !parsedUser.name || !parsedUser.role) {
      return res.status(401).json({ message: 'Thông tin người dùng không hợp lệ.' });
    }

    // Gán thông tin người dùng vào request để sử dụng ở các route sau
    req.user = parsedUser;

    // Tiếp tục xử lý request
    next();
  } catch (err) {
    console.error('Error in auth middleware:', err);
    res.status(401).json({ message: 'Xác thực thất bại.' });
  }
};

module.exports = authMiddleware;