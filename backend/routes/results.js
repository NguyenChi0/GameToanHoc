const express = require("express");
const router = express.Router();
const conn = require("../db");

router.post("/", (req, res) => {
  const {
    taikhoan_id,
    lesson_id,
    total_questions,
    correct_answers,
    total_score,
  } = req.body;
  if (!taikhoan_id || !lesson_id)
    return res.status(400).json({ message: "Thiếu thông tin" });

  const query = `
        INSERT INTO lesson_results 
        (taikhoan_id, lesson_id, total_questions, correct_answers, total_score)
        VALUES (?, ?, ?, ?, ?)
    `;
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
