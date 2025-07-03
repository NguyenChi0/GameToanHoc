//Game1.jsx: Hiển thị câu hỏi text, đáp án dạng nút
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Game1({ lessonId, lessonName }) {
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

  const handleAnswer = (choice) => {
    const q = questions[current];
    if (choice === q.correct_answer) {
      setScore(score + 1);
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      alert(
        `✅ Hoàn thành bài "${lessonName}" với ${
          score + (choice === q.correct_answer ? 1 : 0)
        } điểm!`
      );
      navigate("/");
    }
  };

  if (questions.length === 0) return <p>Đang tải câu hỏi...</p>;

  const q = questions[current];
  let options = [];
  try {
    options = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
  } catch (err) {
    console.error("Lỗi khi parse options:", err);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🧠 {lessonName}</h2>
      <p>
        Câu {current + 1}/{questions.length}
      </p>
      <p style={{ fontSize: "20px" }}>{q.content}</p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {options.map((opt, idx) => (
          <button key={idx} onClick={() => handleAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Game1;
