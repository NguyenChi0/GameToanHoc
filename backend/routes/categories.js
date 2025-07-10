// backend/routes/categories.js- Xử lý các API liên quan đến danh mục (category)
const express = require("express");
const router = express.Router();
const conn = require("../db");

// Lấy danh sách tất cả categories
router.get("/", (req, res) => {
  conn.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json(results);
  });
});

// Thêm 1 category mới
router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Thiếu tên category" });

  conn.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Lỗi khi thêm category" });
      res.json({ message: "Đã thêm category", id: result.insertId });
    }
  );
});

//Cập nhật category theo ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Thiếu tên category" });

  conn.query(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Lỗi khi cập nhật category" });
      res.json({ message: "Đã cập nhật category" });
    }
  );
});

// Xoá category theo ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  conn.query("DELETE FROM categories WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi khi xoá category" });
    res.json({ message: "Đã xoá category" });
  });
});

module.exports = router;
