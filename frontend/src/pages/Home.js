import React, { useEffect, useState } from "react";

export default function Home({ username }) {
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [score, setScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách category
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Lỗi lấy categories:", err));
  }, []);

  // Lấy danh sách lesson theo category
  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://localhost:5000/api/lessons?category_id=${selectedCategory}`)
        .then((res) => res.json())
        .then(setLessons)
        .catch((err) => console.error("Lỗi lấy lessons:", err));
    } else {
      setLessons([]);
      setSelectedLesson(null);
    }
  }, [selectedCategory]);

  // Lấy điểm người dùng
  useEffect(() => {
    if (username) {
      fetch(`http://localhost:5000/api/auth/get-score/${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.score !== undefined) setScore(data.score);
          else setError(data.message);
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

      {/* Chọn Category */}
      <div>
        <h2>📂 Chọn Phép Toán</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: "8px 12px",
                backgroundColor:
                  selectedCategory === cat.id ? "#e6f2ff" : "#fff",
                border: "2px solid #0066cc",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chọn Lesson */}
      {lessons.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>📘 Chọn Bài Học</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                style={{
                  padding: "8px 12px",
                  backgroundColor:
                    selectedLesson?.id === lesson.id ? "#d1ffd1" : "#fff",
                  border: "2px solid #00cc66",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {lesson.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hiển thị Game */}
      {selectedLesson && (
        <div style={{ marginTop: "30px" }}>
          <h2>🎮 Đang chơi: {selectedLesson.name}</h2>
          <div
            style={{
              height: "600px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <iframe
              src={`/${selectedLesson.file}`}
              title={selectedLesson.name}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
