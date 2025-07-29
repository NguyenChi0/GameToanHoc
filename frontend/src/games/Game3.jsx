import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import API from "../api";


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

const BALLOON_IMAGES = [
  '/images/balloon1.png',
  '/images/balloon2.png',
  '/images/balloon3.png',
  '/images/balloon.png',
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
  
  /* Overlay để làm nổi bật text */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
  border-radius: 50%;
  cursor: pointer;
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
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
`;


const BackButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
`;

const PlayAgainButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;

  &:hover {
    background-color: #1976D2;
    transform: translateX(-50%) scale(1.05);
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
  background-image: url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  
  /* Overlay để nổi bật text */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    z-index: -1;
  }
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

export default function Game3({ lessonId }) {
  const [questions, setQuestions] = useState([]);
  const [lessonInfo, setLessonInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', isCorrect: false, show: false });
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  
  // Sử dụng useRef để theo dõi điểm thực tế (không bị ảnh hưởng bởi React state batching)
  const actualScore = useRef(0);

useEffect(() => {
    API.get(`/questions/lesson/${lessonId}`)
      .then((res) => {
        setQuestions(res.data.questions);
        setLessonInfo(res.data.lessonInfo);
      })
      .catch((err) => console.error("Lỗi khi lấy câu hỏi:", err));
}, [lessonId]);


const saveScore = async (additionalScore) => {
  console.log(`Đang lưu điểm: ${additionalScore}`);
  try {
    const res = await API.post('/score/save', {
      username,
      score: additionalScore,
      action: 'add'
    });
    return res.data; // axios đã parse JSON cho bạn
  } catch (error) {
    console.error('Lỗi khi lưu điểm:', error);
    return null;
  }
};


  const handleAnswer = (answer) => {
    const question = questions[currentIndex];
    const pointsEarned = 10;
    
    if (answer === question.correct_answer) {
      // Cập nhật cả state (để hiển thị) và ref (để tính toán chính xác)
      setScore(prev => prev + pointsEarned);
      actualScore.current += pointsEarned;
      
      console.log(`✅ Đáp án đúng! Điểm tạm thời: ${actualScore.current}`);
      setFeedback({ message: `Chính xác! +${pointsEarned} điểm`, isCorrect: true, show: true });
    } else {
      console.log(`❌ Đáp án sai!`);
      setFeedback({ message: `Sai rồi! Đáp án đúng là: ${question.correct_answer}`, isCorrect: false, show: true });
    }

    setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        completeGame();
      }
    }, 2000);
  };

  const completeGame = async () => {
    setGameCompleted(true);
    const totalScore = actualScore.current;

    console.log("🎯 === HOÀN THÀNH GAME ===");
    console.log("📊 Điểm từ câu hỏi:", actualScore.current);
    console.log("🏆 Tổng điểm cuối:", totalScore);

    // Lưu điểm từ câu hỏi nếu có
    if (actualScore.current > 0) {
      console.log("💾 Lưu điểm từ câu hỏi...");
      await saveScore(actualScore.current);
    }

    setFeedback({ message: `🎉 Hoàn thành! Tổng điểm: ${totalScore}`, isCorrect: true, show: true });
    // Không tự động chuyển trang nữa, để người dùng chọn
  };

  const goToHome = () => {
    navigate('..');
  };

  const playAgain = () => {
    // Reset game state
    setCurrentIndex(0);
    setScore(0);
    actualScore.current = 0;
    setGameCompleted(false);
    setFeedback({ message: '', isCorrect: false, show: false });
    
    console.log("🔄 Chơi lại game!");
  };

  const endGame = async () => {
    if (window.confirm("Bạn có chắc muốn kết thúc game? Điểm của bạn sẽ được lưu lại.")) {
      console.log("🛑 === DỪNG GAME ===");
      console.log("📊 Điểm hiện tại:", actualScore.current);
      
      // Chỉ lưu điểm nếu có điểm
      if (actualScore.current > 0) {
        console.log("💾 Lưu điểm hiện tại...");
        await saveScore(actualScore.current);
      }
      navigate('..');
    }
  };

  if (!lessonInfo || questions.length === 0) return <p>Đang tải câu hỏi...</p>;

  if (gameCompleted) {
    return (
      <GameContainer>
        <Sky>
          <ScoreDisplay>Điểm: {actualScore.current}</ScoreDisplay>
          <FeedbackMessage show={feedback.show} isCorrect={feedback.isCorrect}>
            {feedback.message}
          </FeedbackMessage>
          <BackButton onClick={goToHome}>🏠 Về trang chủ</BackButton>
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
        <QuestionBox>{question.content}</QuestionBox>
        <EndGameButton onClick={endGame}>Kết thúc game</EndGameButton>
        <FeedbackMessage show={feedback.show} isCorrect={feedback.isCorrect}>
          {feedback.message}
        </FeedbackMessage>
        {options.map((option, index) => {
  const startPos = Math.random() * 70 + 15;
  const duration = Math.random() * 6 + 6;
  const delay = Math.random() * 4;
  const color = BALLOON_COLORS[index % BALLOON_COLORS.length];
  const randomImage = BALLOON_IMAGES[Math.floor(Math.random() * BALLOON_IMAGES.length)];

  return (
    <Balloon
      key={index}
      color={color}
      bgImage={randomImage} // THÊM DÒNG NÀY
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