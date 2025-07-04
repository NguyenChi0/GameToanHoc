const express = require("express");
const router = express.Router();
const conn = require("../db");

// API lưu điểm (cộng hoặc gán)
router.post("/save", (req, res) => {
  const { username, score, action } = req.body;

  if (!username || score === undefined || isNaN(score)) {
    return res.status(400).json({ message: "Thiếu username hoặc điểm không hợp lệ" });
  }

  const parsedScore = parseInt(score);
  let query = "";
  let values = [];

  if (action === "add") {
    query = `UPDATE taikhoan SET score = IFNULL(score, 0) + ? WHERE username = ?`;
    values = [parsedScore, username];
  } else if (action === "set") {
    query = `UPDATE taikhoan SET score = ? WHERE username = ?`;
    values = [parsedScore, username];
  } else {
    return res.status(400).json({ message: "Hành động không hợp lệ. Chỉ hỗ trợ 'add' hoặc 'set'" });
  }

  console.log("📥 Nhận yêu cầu lưu điểm:", { username, score: parsedScore, action });

  conn.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi cập nhật điểm:", err);
      return res.status(500).json({ message: "Lỗi server khi cập nhật điểm" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json({
      success: true,
      message: action === "add" ? "Đã cộng điểm thành công" : "Đã cập nhật điểm thành công"
    });
  });
});

// API lấy điểm hiện tại của user
router.get("/:username", (req, res) => {
  const { username } = req.params;
  const query = "SELECT score FROM taikhoan WHERE username = ?";

  conn.query(query, [username], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy điểm:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json({ score: results[0].score });
  });
});

module.exports = router;
