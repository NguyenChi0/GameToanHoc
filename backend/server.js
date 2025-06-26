const express = require('express');
const cors = require('cors');
const app = express();
const conn = require('./db');

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Endpoint để lưu điểm
app.post('/api/auth/save-score', (req, res) => {
    const { username, score } = req.body;
    if (!username || score === undefined) {
        return res.status(400).json({ message: 'Thiếu username hoặc score' });
    }

    const query = 'UPDATE taikhoan SET score = ? WHERE username = ?';
    conn.query(query, [score, username], (err, result) => {
        if (err) {
            console.error('Error updating score:', err);
            return res.status(500).json({ message: 'Lỗi server khi lưu điểm' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json({ message: 'Điểm đã được lưu thành công' });
    });
});

// Endpoint để lấy điểm
app.get('/api/auth/get-score/:username', (req, res) => {
    const { username } = req.params;
    const query = 'SELECT score FROM taikhoan WHERE username = ?';
    conn.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching score:', err);
            return res.status(500).json({ message: 'Lỗi server khi lấy điểm' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json({ score: results[0].score });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});