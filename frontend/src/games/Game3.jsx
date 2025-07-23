import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";


const BALLOON_IMAGES = ['/images/balloon1.png', '/images/balloon2.png', '/images/balloon3.png', '/images/balloon.png'];

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

// === Styled Components ===
const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url('/images/sky.png');
  background-size: cover;
  background-position: center;
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
  background-image: url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3...');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 15px 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 10;
  text-align: center;
  max-width: 80%;
  border: 3px solid #FFD700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    z-index: -1;
  }
`;

const Balloon = styled.div`
  position: absolute;
  bottom: -200px;
  width: 150px;
  height: 180px;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  cursor: crosshair;
  animation: ${props => floatUp(props.startPos)} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  &:hover {
    transform: scale(1.15) !important;
  }
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0,0,0,0.4);
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  z-index: 20;
`;

const FeedbackMessage = styled.div`
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => (props.isCorrect ? '#4CAF50' : '#FF5252')};
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  z-index: 15;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: opacity 0.5s ease;
`;

const Button = styled.button`
  position: absolute;
  bottom: 20px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s;
`;

const BackButton = styled(Button)`
  left: 20px;
  background-color: #4CAF50;
  &:hover { background-color: #45a049; transform: scale(1.05); }
`;

const PlayAgainButton = styled(Button)`
  left: 50%;
  transform: translateX(-50%);
  background-color: #2196F3;
  &:hover { background-color: #1976D2; transform: translateX(-50%) scale(1.05); }
`;

const EndGameButton = styled(Button)`
  right: 20px;
  background-color: #FF5252;
  &:hover { background-color: #FF0000; transform: scale(1.05); }
`;

// === Component Game3 ===
export default function Game3({ lessonId }) {
  const [questions, setQuestions] = useState([]);
  const [lessonInfo, setLessonInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', isCorrect: false, show: false });
  const actualScore = useRef(0);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

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
    try {
      const res = await fetch('http://localhost:5000/api/score/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score: additionalScore, action: 'add' })
      });
      if (!res.ok) throw new Error('Lỗi khi lưu điểm');
    } catch (err) {
      console.error("❌", err);
    }
  };

  const handleAnswer = (answer) => {
    const question = questions[currentIndex];
    const correct = answer === question.correct_answer;
    const point = 10;

    if (correct) {
      setScore(prev => prev + point);
      actualScore.current += point;
      setFeedback({ message: `✅ Chính xác! +${point} điểm`, isCorrect: true, show: true });
    } else {
      setFeedback({ message: `❌ Sai rồi! Đúng là: ${question.correct_answer}`, isCorrect: false, show: true });
    }

    setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        completeGame();
      }
    }, 2000);
  };

  const completeGame = async () => {
    setGameCompleted(true);
    if (actualScore.current > 0) await saveScore(actualScore.current);
    setFeedback({ message: `🎉 Hoàn thành! Tổng điểm: ${actualScore.current}`, isCorrect: true, show: true });
  };

  const goToHome = () => navigate('..');
  const playAgain = () => {
    setCurrentIndex(0);
    setScore(0);
    actualScore.current = 0;
    setGameCompleted(false);
    setFeedback({ message: '', isCorrect: false, show: false });
  };
  const endGame = async () => {
    if (window.confirm("Bạn muốn kết thúc game?")) {
      if (actualScore.current > 0) await saveScore(actualScore.current);
      navigate('..');
    }
  };

  if (!lessonInfo || questions.length === 0) return <p>Đang tải câu hỏi...</p>;
  if (gameCompleted) {
    return (
      <GameContainer>
        <Sky>
          <ScoreDisplay>Điểm: {actualScore.current}</ScoreDisplay>
          <FeedbackMessage show={feedback.show} isCorrect={feedback.isCorrect}>{feedback.message}</FeedbackMessage>
          <BackButton onClick={goToHome}>🏠 Trang chủ</BackButton>
          <PlayAgainButton onClick={playAgain}>🔄 Chơi lại</PlayAgainButton>
        </Sky>
      </GameContainer>
    );
  }

  const question = questions[currentIndex];
  const options = [...question.options].sort(() => Math.random() - 0.5);

  return (
    <GameContainer>
      <Sky>
        <ScoreDisplay>Điểm: {score}</ScoreDisplay>
        <QuestionBox>
          {question.question_type === "image" ? (
            <img src={`/images/${question.content}`} alt="question" style={{ maxWidth: '280px' }} />
          ) : (
            question.content
          )}
        </QuestionBox>

        <EndGameButton onClick={endGame}>⛔ Kết thúc</EndGameButton>
        <FeedbackMessage show={feedback.show} isCorrect={feedback.isCorrect}>{feedback.message}</FeedbackMessage>

        {options.map((option, index) => {
          const startPos = Math.random() * 70 + 15;
          const duration = Math.random() * 6 + 6;
          const delay = Math.random() * 4;
          const randomImage = BALLOON_IMAGES[Math.floor(Math.random() * BALLOON_IMAGES.length)];

          return (
            <Balloon
              key={index}
              bgImage={randomImage}
              startPos={startPos}
              duration={duration}
              delay={delay}
              onClick={() => handleAnswer(option)}
            >
              {question.answer_type === "image" ? (
                <img src={`/images/${option}`} alt={`option-${index}`} style={{ maxWidth: "60px" }} />
              ) : (
                option
              )}
            </Balloon>
          );
        })}
      </Sky>
    </GameContainer>
  );
}
