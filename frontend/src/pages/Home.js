import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ username }) {
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [score, setScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Ánh xạ operation → các game phù hợp
  const operationToGames = {
    add: ["game4.html"],
    subtract: ["game1.html", "game2.html", "game3.html"],
    multiply: ["game1.html", "game2.html", "game3.html"],
    divide: ["game1.html", "game2.html", "game3.html"],
    count: ["game4.html"],
    compare: ["game4.html"],
    order: ["game4.html"],
    // Mặc định nếu không có operation
    default: ["game1.html", "game2.html", "game3.html"],
  };

  // Lấy danh sách category
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Lỗi lấy categories:", err));
  }, []);

  // Lấy tất cả lessons
  useEffect(() => {
    fetch("http://localhost:5000/api/lessons")
      .then((res) => res.json())
      .then(setLessons)
      .catch((err) => console.error("Lỗi lấy lessons:", err));
  }, []);

  // Lấy điểm người dùng
  const fetchScore = () => {
    if (username) {
      fetch(`http://localhost:5000/api/score/${username}`)
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
  };

  useEffect(() => {
    fetchScore();
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

      {/* Hiển thị danh sách Category và bài học */}
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
                      if (lesson.type === "visual") {
                        // Xử lý game dạng hình ảnh nếu có
                        navigate(`/visual/${lesson.id}`, {
                          state: {
                            lessonName: lesson.name,
                          },
                        });
                      } else {
                        // Chọn random 1 game phù hợp
                        const list =
                          operationToGames[lesson.operation] ||
                          operationToGames.default;
                        const randomGame =
                          list[Math.floor(Math.random() * list.length)];
                        navigate(`/game/${lesson.id}`, {
                          state: {
                            game: randomGame,
                            operation: lesson.operation,
                            level: lesson.level,
                            lessonName: lesson.name,
                          },
                        });
                      }
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
