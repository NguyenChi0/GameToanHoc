const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const conn = require("./db");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("frontend/public"));

// Routes
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score"); // ⬅ đây là file mới bạn đang tách
const categoryRoutes = require("./routes/categories");
const lessonRoutes = require("./routes/lessons");
const resultRoutes = require("./routes/results");
const questionsRouter = require("./routes/questions");

// Sử dụng route
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes); // ⬅ endpoint lưu điểm
app.use("/api/categories", categoryRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/questions", questionsRouter);

// Test route
app.get("/", (req, res) => res.send("✅ Backend OK"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
