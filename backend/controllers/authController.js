const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret123';

exports.register = (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 8);
  db.query('INSERT INTO taikhoan (username, password) VALUES (?, ?)', [username, hashed], (err, result) => {
    if (err) {
      console.error('Lỗi đăng ký:', err);
      return res.status(500).json({ error: 'Tài khoản đã tồn tại hoặc lỗi server' });
    }
    res.json({ message: 'Đăng ký thành công' });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM taikhoan WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn đăng nhập:', err);
      return res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
    }

    if (results.length === 0)
      return res.status(400).json({ error: 'Sai tài khoản hoặc mật khẩu' });

    const user = results[0];
    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(400).json({ error: 'Mật khẩu không đúng' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token, username: user.username });
  });
};
