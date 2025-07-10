// backend/routes/lesson_results.js - Xử lý lưu kết quả học tập của người chơi
const express = require("express");
const router = express.Router();
const conn = require("../db");

// API để lưu kết quả một lượt chơi (khi kết thúc bài học)
router.post("/", (req, res) => {
  const {
    taikhoan_id,
    lesson_id,
    total_questions,
    correct_answers,
    total_score,
  } = req.body;
  // Kiểm tra dữ liệu đầu vào
  if (!taikhoan_id || !lesson_id)
    return res.status(400).json({ message: "Thiếu thông tin" });

  // Câu lệnh SQL để thêm kết quả vào bảng lesson_results
  const query = `
        INSERT INTO lesson_results 
        (taikhoan_id, lesson_id, total_questions, correct_answers, total_score)
        VALUES (?, ?, ?, ?, ?)
    `;
  // Thực thi query
  conn.query(
    query,
    [taikhoan_id, lesson_id, total_questions, correct_answers, total_score],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Lỗi server" });
      res.json({ message: "Đã lưu kết quả học", result_id: result.insertId });
    }
  );
});

module.exports = router;
