// Game2.jsx: Câu hỏi hình ảnh, đáp án text
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Game2({ lessonId, lessonName }) {
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
      alert(`✅ Kết thúc! Điểm: ${score + (opt === q.correct_answer ? 1 : 0)}`);
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
      <h2>📸 {lessonName}</h2>
      {q.image_url && <img src={q.image_url} alt="Câu hỏi" width={200} />}
      <p style={{ marginTop: "10px" }}>Chọn đáp án đúng:</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {options.map((opt, idx) => (
          <button key={idx} onClick={() => handleAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Game2;
