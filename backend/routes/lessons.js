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

module.exports = router;
