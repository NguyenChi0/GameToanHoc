//Game3.jsx: Câu hỏi text, đáp án là ảnh
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Game3({ lessonId, lessonName }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/questions?lesson_id=${lessonId}`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  }, [lessonId]);

  const handleAnswer = (opt) => {
    const q = questions[current];
    if (opt === q.correct_answer) {
      setScore(score + 1);
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      alert(
        `✅ Kết thúc game hình ảnh! Điểm: ${
          score + (opt === q.correct_answer ? 1 : 0)
        }`
      );
      navigate("/");
    }
  };

  if (questions.length === 0) return <p>Đang tải...</p>;

  const q = questions[current];
  let options = [];
  try {
    options = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
  } catch (err) {
    console.error("Lỗi khi parse options:", err);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🖼️ {lessonName}</h2>
      <p>{q.content}</p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {options.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Đáp án ${idx + 1}`}
            width={120}
            style={{
              cursor: "pointer",
              border: "2px solid #ccc",
              borderRadius: "8px",
            }}
            onClick={() => handleAnswer(img)}
          />
        ))}
      </div>
    </div>
  );
}

export default Game3;
