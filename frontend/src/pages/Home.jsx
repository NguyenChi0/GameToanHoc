import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // ✅ import API đã tạo

export default function Home({ username }) {
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [score, setScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Lấy danh mục phép toán
  useEffect(() => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi lấy categories:", err));
  }, []);

  // ✅ Lấy bài học
  useEffect(() => {
    API.get("/lessons")
      .then((res) => setLessons(res.data))
      .catch((err) => console.error("Lỗi lấy lessons:", err));
  }, []);

  // ✅ Lấy điểm
  useEffect(() => {
    if (username) {
      API.get(`/score/${username}`)
        .then((res) => {
          if (res.data.score !== undefined) setScore(res.data.score);
          else setError(res.data.message);
        })
        .catch(() => setError("Lỗi khi lấy điểm"))
        .finally(() => setLoadingScore(false));
    } else {
      setLoadingScore(false);
    }
  }, [username]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>📚 Game Học Toán</h1>

      {/* Thông tin người dùng */}
      {username ? (
        <div
          style={{
            marginBottom: "20px",
            backgroundColor: "#f0f8ff",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <p>
            Xin chào, <strong>{username}</strong>!
          </p>
          {loadingScore ? (
            <p>Đang tải điểm...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <p>
              Điểm hiện tại: <strong>{score}</strong>
            </p>
          )}
        </div>
      ) : (
        <p style={{ color: "red" }}>Vui lòng đăng nhập để lưu điểm.</p>
      )}

      {/* Hiển thị danh mục và bài học */}
      <div>
        {categories.map((cat) => (
          <div key={cat.id} style={{ marginBottom: "30px" }}>
            <h2>📂 {cat.name}</h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
              }}
            >
              {lessons
                .filter((l) => l.category_id === cat.id)
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      navigate(`/game/${lesson.id}`, {
                        state: {
                          lessonId: lesson.id,
                          lessonName: lesson.name,
                          operation: lesson.operation,
                          level: lesson.level,
                        },
                      });
                    }}
                    style={{
                      padding: "12px",
                      border: "1px solid #00cc66",
                      borderRadius: "6px",
                      minWidth: "200px",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <strong>{lesson.name}</strong>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
