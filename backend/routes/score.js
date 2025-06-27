const express = require("express");
const router = express.Router();
const conn = require("../db");

// Lưu điểm
router.post("/save", (req, res) => {
  const { username, score } = req.body;
  if (!username || score === undefined) {
    return res.status(400).json({ message: "Thiếu username hoặc score" });
  }

  const query = "UPDATE taikhoan SET score = ? WHERE username = ?";
  conn.query(query, [score, username], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ message: "Lưu điểm thành công" });
  });
});

// Lấy điểm
router.get("/:username", (req, res) => {
  const { username } = req.params;
  const query = "SELECT score FROM taikhoan WHERE username = ?";
  conn.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (results.length === 0)
      return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ score: results[0].score });
  });
});

module.exports = router;
