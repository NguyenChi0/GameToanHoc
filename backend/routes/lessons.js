const express = require("express");
const router = express.Router();
const conn = require("../db");

// Lấy tất cả bài học hoặc lọc theo category_id, kèm tên category
router.get("/", (req, res) => {
  const { category_id } = req.query;
  let sql = `
    SELECT lessons.*, categories.name AS category_name
    FROM lessons
    JOIN categories ON lessons.category_id = categories.id
  `;
  const params = [];

  if (category_id) {
    sql += " WHERE lessons.category_id = ?";
    params.push(category_id);
  }

  conn.query(sql, params, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Lỗi server khi lấy lessons" });
    res.json(results);
  });
});

// Lấy 1 bài học theo ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM lessons WHERE id = ?";
  conn.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (results.length === 0)
      return res.status(404).json({ message: "Không tìm thấy bài học" });
    res.json(results[0]);
  });
});

// Thêm bài học mới
router.post("/", (req, res) => {
  const { category_id, name, required_score, operation, level, type } =
    req.body;

  if (!category_id || !name)
    return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });

  const sql = `
    INSERT INTO lessons (category_id, name, required_score, operation, level, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  conn.query(
    sql,
    [
      category_id,
      name,
      required_score || 0,
      operation || null,
      level || 1,
      type || "arithmetic",
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Lỗi khi thêm bài học" });
      res.json({ message: "Đã thêm bài học", lesson_id: result.insertId });
    }
  );
});

// Cập nhật bài học
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { category_id, name, required_score, operation, level, type } =
    req.body;

  const sql = `
    UPDATE lessons SET 
      category_id=?, 
      name=?, 
      required_score=?, 
      operation=?, 
      level=?, 
      type=?
    WHERE id=?
  `;

  conn.query(
    sql,
    [category_id, name, required_score, operation, level, type, id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Lỗi khi cập nhật bài học" });
      res.json({ message: "Đã cập nhật bài học" });
    }
  );
});

// Xóa bài học
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM lessons WHERE id = ?";
  conn.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi khi xoá bài học" });
    res.json({ message: "Đã xoá bài học" });
  });
});

module.exports = router;
