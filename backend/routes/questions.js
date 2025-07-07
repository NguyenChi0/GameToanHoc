const express = require("express");
const router = express.Router();
const conn = require("../db");

// API cũ: lấy câu hỏi theo lesson_id đơn giản
router.get("/", (req, res) => {
  const { lesson_id } = req.query;

  // Nếu lesson_id là "all", lấy tất cả câu hỏi
  if (lesson_id === "all") {
    conn.query("SELECT * FROM questions", (err, results) => {
      if (err) return res.status(500).json({ message: "Lỗi server" });
      return res.json(results);
    });
    return;
  }

  if (!lesson_id) {
    return res.status(400).json({ message: "Thiếu lesson_id" });
  }

  const sql = "SELECT * FROM questions WHERE lesson_id = ?";
  conn.query(sql, [lesson_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json(results);
  });
});

// API mới: lấy câu hỏi + thông tin bài học theo lessonId
router.get("/lesson/:lessonId", (req, res) => {
  const { lessonId } = req.params;

  const sql = `
    SELECT 
      q.id AS question_id,
      q.content,
      q.correct_answer,
      q.options,
      q.question_type,
      q.answer_type,
      q.image_url,
      l.id AS lesson_id,
      l.name AS lesson_name,
      l.operation,
      l.level,
      l.type,
      c.name AS category_name
    FROM questions q
    JOIN lessons l ON q.lesson_id = l.id
    JOIN categories c ON l.category_id = c.id
    WHERE l.id = ?
  `;

  conn.query(sql, [lessonId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi server", error: err });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy câu hỏi cho bài học này" });
    }

    // Thông tin bài học
    const lessonInfo = {
      lesson_id: results[0].lesson_id,
      lesson_name: results[0].lesson_name,
      operation: results[0].operation,
      level: results[0].level,
      type: results[0].type,
      category_name: results[0].category_name,
    };

    // Xử lý câu hỏi
    const questions = results.map((q) => {
      let options = [];

      try {
        if (typeof q.options === "string") {
          // Nếu là chuỗi JSON: parse
          options = JSON.parse(q.options);
        } else if (Array.isArray(q.options)) {
          // Nếu đã là mảng
          options = q.options;
        } else {
          // Nếu kiểu khác: ép thành chuỗi và split
          options = String(q.options)
            .split(",")
            .map((s) => s.trim());
        }
      } catch (e) {
        // Nếu parse JSON thất bại: fallback bằng split
        options = String(q.options)
          .split(",")
          .map((s) => s.trim());
      }

      return {
        question_id: q.question_id,
        content: q.content,
        correct_answer: q.correct_answer,
        options,
        question_type: q.question_type,
        answer_type: q.answer_type,
        image_url: q.image_url,
      };
    });

    // Trả kết quả
    res.json({ lessonInfo, questions });
  });
});

module.exports = router;
