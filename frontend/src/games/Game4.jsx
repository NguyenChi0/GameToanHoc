import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 32px;
  background: #f0f9ff;
  min-height: 100vh;
`;

const QuestionBox = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
`;

const OptionButton = styled.button`
  background: #fff;
  border: 2px solid #d1d5db;
  border-radius: 12px;
  padding: 16px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background: #e0f2fe;
  }
`;

export default function Game4({ lessonId }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/questions/lesson/${lessonId}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions))
      .catch((err) => console.error("Fetch error:", err));
  }, [lessonId]);

  if (questions.length === 0) return <Container>Đang tải câu hỏi...</Container>;

  const question = questions[currentIndex];

  const renderContent = () => {
    if (question.question_type === "image") {
      return (
        <img
          src={`/images/${question.content}`}
          alt="question"
          style={{ maxWidth: "300px" }}
        />
      );
    }
    return <h2>{question.content}</h2>;
  };

  const renderOption = (option, index) => {
    const isImage = question.answer_type === "image";
    return (
      <OptionButton key={index} onClick={() => handleAnswer(option)}>
        {isImage ? (
          <img
            src={`/images/${option}`}
            alt={`option-${index}`}
            style={{ maxWidth: "100px" }}
          />
        ) : (
          option
        )}
      </OptionButton>
    );
  };

  const handleAnswer = (option) => {
    const correct = option === question.correct_answer;
    setFeedback(
      correct
        ? "✅ Đúng rồi!"
        : `❌ Sai! Đáp án đúng là ${question.correct_answer}`
    );
    setTimeout(() => {
      setFeedback("");
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        alert("🎉 Đã hoàn thành tất cả câu hỏi!");
      }
    }, 1500);
  };

  return (
    <Container>
      <QuestionBox>{renderContent()}</QuestionBox>
      <OptionsGrid>
        {question.options.map((opt, idx) => renderOption(opt, idx))}
      </OptionsGrid>
      {feedback && (
        <p style={{ textAlign: "center", marginTop: "16px" }}>{feedback}</p>
      )}
    </Container>
  );
}
