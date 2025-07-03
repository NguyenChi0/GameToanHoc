const express = require("express");
const router = express.Router();
const conn = require("../db");

router.get("/", (req, res) => {
  const { lesson_id } = req.query;

  if (!lesson_id) {
    return res.status(400).json({ message: "Thiếu lesson_id" });
  }

  const sql = "SELECT * FROM questions WHERE lesson_id = ?";
  conn.query(sql, [lesson_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json(results);
  });
});

module.exports = router;
