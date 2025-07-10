// backend/routes/score.js - Xử lý lưu và lấy điểm tổng của người chơi
const express = require("express");
const router = express.Router();
const conn = require("../db");

// API lưu điểm (cộng hoặc gán)
router.post("/save", (req, res) => {
  const { username, score, action } = req.body;

  // Kiểm tra đầu vào hợp lệ
  if (!username || score === undefined || isNaN(score)) {
    return res
      .status(400)
      .json({ message: "Thiếu username hoặc điểm không hợp lệ" });
  }

  const parsedScore = parseInt(score); // Chuyển score sang dạng số nguyên
  let query = "";
  let values = [];

  // Nếu action là "add" → cộng dồn điểm vào điểm cũ
  if (action === "add") {
    query = `UPDATE taikhoan SET score = IFNULL(score, 0) + ? WHERE username = ?`;
    values = [parsedScore, username];
  }
  // Nếu action là "set" → gán điểm mới
  else if (action === "set") {
    query = `UPDATE taikhoan SET score = ? WHERE username = ?`;
    values = [parsedScore, username];
  }
  // Nếu action không hợp lệ
  else {
    return res
      .status(400)
      .json({ message: "Hành động không hợp lệ. Chỉ hỗ trợ 'add' hoặc 'set'" });
  }

  console.log("📥 Nhận yêu cầu lưu điểm:", {
    username,
    score: parsedScore,
    action,
  });
  // Thực thi query để cập nhật điểm
  conn.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi cập nhật điểm:", err);
      return res.status(500).json({ message: "Lỗi server khi cập nhật điểm" });
    }
    // Nếu không tìm thấy user
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    // Trả kết quả thành công
    res.json({
      success: true,
      message:
        action === "add"
          ? "Đã cộng điểm thành công"
          : "Đã cập nhật điểm thành công",
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

    res.json({ score: results[0].score }); // Trả về điểm hiện tại của user
  });
});

module.exports = router;
