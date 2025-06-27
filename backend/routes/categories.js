const express = require("express");
const router = express.Router();
const conn = require("../db");

router.get("/", (req, res) => {
  conn.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json(results);
  });
});

module.exports = router;
