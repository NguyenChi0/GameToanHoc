import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// Màu sắc cho các bóng bay
const BALLOON_COLORS = [
  "#FF5252", // Đỏ
  "#FFEB3B", // Vàng
  "#4CAF50", // Xanh lá
  "#2196F3", // Xanh dương
  "#9C27B0", // Tím
  "#FF9800", // Cam
  "#E91E63", // Hồng
];

// Tạo animation bay ngẫu nhiên
const floatUp = (startPos) => keyframes`
  0% {
    bottom: -200px;
    left: ${startPos}%;
    opacity: 0;
    transform: scale(0.8);
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: scale(1.1) rotate(${Math.random() * 10 - 5}deg);
  }
  100% {
    bottom: 110%;
    left: ${startPos + (Math.random() * 20 - 10)}%;
    opacity: 0;
    transform: scale(0.9);
  }
`;

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #87CEEB, #E0F7FA);
  overflow: hidden;
  position: relative;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const Sky = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const QuestionBox = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 10;
  text-align: center;
  max-width: 80%;
  border: 3px solid #FFD700;
`;

const Balloon = styled.div`
  position: absolute;
  bottom: -200px;
  width: 150px;
  height: 180px;
  background: ${props => props.color};
  border-radius: 50%;
  cursor: pointer;
  animation: ${props => floatUp(props.startPos)} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 5;
  box-shadow: inset -10px -10px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  
  &:hover {
    transform: scale(1.15) !important;
    box-shadow: inset -15px -15px 20px rgba(0, 0, 0, 0.3);
  }
  
  /* Tạo hiệu ứng bóng bay thật hơn */
  &::after {
    content: "";
    position: absolute;
    bottom: -15px;
    width: 30px;
    height: 40px;
    background: ${props => props.color};
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
`;

const EndGameButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #FF5252;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;

  &:hover {
    background-color: #FF0000;
    transform: scale(1.05);
  }
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

export default function Game3({ lessonId }) {
  const [questions, setQuestions] = useState([]);
  const [lessonInfo, setLessonInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Giả sử username được lưu trong localStorage

  useEffect(() => {
    fetch(`http://localhost:5000/api/questions/lesson/${lessonId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setLessonInfo(data.lessonInfo);
      })
      .catch((err) => console.error("Lỗi khi lấy câu hỏi:", err));
  }, [lessonId]);

  const saveScore = async (additionalScore) => {
    console.log(`Đang lưu điểm: ${score}`);

    try {
      const response = await fetch('http://localhost:5000/api/score/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          score: additionalScore,
          action: 'add' // Thêm điểm vào điểm hiện có
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi lưu điểm');
      }
      return data;
    } catch (error) {
      console.error('Lỗi khi lưu điểm:', error);
      return null;
    }
    
  };

  const handleAnswer = (answer) => {
  if (answer === question.correct_answer) {
    const pointsEarned = 10;
    setScore(prev => prev + pointsEarned); // ✅ Sửa lại
    alert(`🎯 Chính xác! Bạn được +${pointsEarned} điểm`);
  } else {
    alert(`💥 Sai rồi! Đáp án đúng là: ${question.correct_answer}`);
  }

  if (currentIndex < questions.length - 1) {
    setCurrentIndex(currentIndex + 1);
  } else {
    completeGame();
  }
};


  const completeGame = async () => {
  setGameCompleted(true);
  const bonusPoints = 50;

  console.log("📊 Tổng điểm trước thưởng:", score);
  console.log("🎁 Điểm thưởng:", bonusPoints);

  if (score > 0) {
    await saveScore(score);
  }

  await saveScore(bonusPoints);

  alert(`🎉 Bạn đã hoàn thành bài học! Tổng điểm: ${score + bonusPoints}`);
  navigate('/lessons');
};


  const endGame = async () => {
    if (window.confirm("Bạn có chắc muốn kết thúc game? Điểm của bạn sẽ được lưu lại.")) {
      await saveScore(score);
      navigate('..');
    }
  };

  if (!lessonInfo || questions.length === 0) return <p>Đang tải câu hỏi...</p>;

  const question = questions[currentIndex];
  const options = [...question.options].sort(() => Math.random() - 0.5); // Xáo trộn đáp án

  return (
    <GameContainer>
      <Sky>
        <ScoreDisplay>Điểm: {score}</ScoreDisplay>
        <QuestionBox>{question.content}</QuestionBox>
        <EndGameButton onClick={endGame}>Kết thúc game</EndGameButton>

        {options.map((option, index) => {
          const startPos = Math.random() * 70 + 15; // 15-85%
          const duration = Math.random() * 6 + 6; // 6-12 giây
          const delay = Math.random() * 4; // 0-4 giây delay
          const color = BALLOON_COLORS[index % BALLOON_COLORS.length];
          
          return (
            <Balloon
              key={index}
              color={color}
              startPos={startPos}
              duration={duration}
              delay={delay}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </Balloon>
          );
        })}
      </Sky>
    </GameContainer>
  );
}