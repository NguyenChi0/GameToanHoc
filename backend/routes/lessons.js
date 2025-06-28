const express = require("express");
const router = express.Router();
const conn = require("../db");

router.get("/", (req, res) => {
  const { category_id } = req.query;
  const query = category_id
    ? "SELECT * FROM lessons WHERE category_id = ?"
    : "SELECT * FROM lessons";
  const values = category_id ? [category_id] : [];

  conn.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json(results);
  });
});

// Lấy danh sách tất cả bài học (kèm tên category nếu cần)
router.get("/", (req, res) => {
  const sql = `SELECT lessons.*, categories.name AS category_name
               FROM lessons
               JOIN categories ON lessons.category_id = categories.id`;
  conn.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Lỗi server khi lấy lessons" });
    res.json(results);
  });
});

// Thêm bài học mới
router.post("/", (req, res) => {
  const { category_id, name, required_score, file } = req.body;
  if (!category_id || !name || !file)
    return res.status(400).json({ message: "Thiếu dữ liệu" });

  const sql = `INSERT INTO lessons (category_id, name, required_score, file) VALUES (?, ?, ?, ?)`;
  conn.query(
    sql,
    [category_id, name, required_score || 0, file],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Lỗi khi thêm bài học" });
      res.json({ message: "Đã thêm bài học", lesson_id: result.insertId });
    }
  );
});

// Cập nhật bài học
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { category_id, name, required_score, file } = req.body;
  const sql = `UPDATE lessons SET category_id=?, name=?, required_score=?, file=? WHERE id=?`;
  conn.query(
    sql,
    [category_id, name, required_score, file, id],
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
  const sql = `DELETE FROM lessons WHERE id = ?`;
  conn.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi khi xoá bài học" });
    res.json({ message: "Đã xoá bài học" });
  });
});

module.exports = router;
