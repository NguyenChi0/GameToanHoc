import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import API from "../api";

const StartScreen = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/background.png') center/cover;
    opacity: 0.3;
    z-index: 1;
  }
`;

const StartContainer = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 60px 80px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 800px;
  margin: 0 20px;
  animation: slideUp 0.8s ease-out;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const GameTitle = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const GameSubtitle = styled.h2`
  font-size: 2rem;
  color: #4a5568;
  margin-bottom: 30px;
  font-weight: 600;
`;

const GameDescription = styled.p`
  font-size: 1.4rem;
  color: #718096;
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StartButton = styled.button`
  padding: 20px 50px;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const GameStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 30px 0;
  padding: 20px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const StatItem = styled.div`
  text-align: center;
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
    display: block;
  }
  
  .stat-label {
    font-size: 1rem;
    color: #718096;
    margin-top: 5px;
  }
`;

const FloatingIcon = styled.div`
  position: absolute;
  font-size: 3rem;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
  z-index: 1;
  
  &:nth-child(1) {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 20%;
    right: 15%;
    animation-delay: 2s;
  }
  
  &:nth-child(3) {
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
  
  &:nth-child(4) {
    bottom: 30%;
    right: 10%;
    animation-delay: 1s;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(5deg); }
    66% { transform: translateY(10px) rotate(-5deg); }
  }
`;

const EndGameButton = styled.button`
  position: absolute;
  bottom: 30px;
  right: 30px;
  padding: 15px 30px;
  background-color: #FF5252;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;

  &:hover {
    background-color: #FF0000;
    transform: scale(1.05);
  }
`;

export default function Game1({ lessonId, lessonName, operation, level }) {
  const [questions, setQuestions] = useState([]);
  const [lessonInfo, setLessonInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  const basketRef = useRef({ x: 0, y: 0, width: 150, height: 75 });
  const applesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const imagesRef = useRef({});
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const saveScore = async (additionalScore) => {
    console.log(`Đang lưu điểm: ${additionalScore}`);
    try {
      const res = await API.post('/score/save', {
        username,
        score: additionalScore,
        action: 'add'
      });
      return res.data;
    } catch (error) {
      console.error('Lỗi khi lưu điểm:', error);
      return null;
    }
  };

  const handleGameComplete = async () => {
    console.log('Game hoàn thành! Đang lưu điểm...');
    await saveScore(score);
  };

  const endGame = async () => {
    if (window.confirm("Bạn có chắc muốn kết thúc game? Điểm của bạn sẽ được lưu lại.")) {
      await saveScore(score);
      navigate('..');
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  useEffect(() => {
    const loadImages = () => {
      const images = {
        apple: new Image(),
        basket: new Image(),
        background: new Image(),
      };

      images.apple.src = "/images/apple.png";
      images.basket.src = "/images/socket.png";
      images.background.src = "/images/background.png";

      imagesRef.current = images;
    };

    loadImages();
  }, []);

  useEffect(() => {
    API.get(`/questions/lesson/${lessonId}`)
      .then((res) => {
        setQuestions(res.data.questions);
        setLessonInfo(res.data.lessonInfo);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, [lessonId]);

  useEffect(() => {
    if (!gameStarted || questions.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const basket = basketRef.current;
    const apples = applesRef.current;

    basket.x = canvas.width / 2 - basket.width / 2;
    basket.y = canvas.height - basket.height - 30;

    const initializeApples = () => {
      apples.length = 0;
      const question = questions[currentIndex];
      question.options.forEach((option, idx) => {
        apples.push({
          x: 120 + idx * 250,
          y: 0,
          width: 80,
          height: 80,
          text: option,
          speed: 1.0 + Math.random() * 0.5,
          isCorrect: option === question.correct_answer,
        });
      });
    };
    initializeApples();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      basket.x = e.clientX - rect.left - basket.width / 2;
      if (basket.x < 0) basket.x = 0;
      if (basket.x > canvas.width - basket.width) basket.x = canvas.width - basket.width;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const gameLoop = () => {
      if (!canvasRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (imagesRef.current.background.complete && imagesRef.current.background.naturalWidth > 0) {
        ctx.drawImage(imagesRef.current.background, 0, 0, canvas.width, canvas.height);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#87CEEB");
        gradient.addColorStop(0.7, "#B0E0E6");
        gradient.addColorStop(1, "#90EE90");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#228B22";
        ctx.fillRect(180, 450, 40, 120);
        ctx.beginPath();
        ctx.arc(200, 450, 60, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(550, 470, 40, 100);
        ctx.beginPath();
        ctx.arc(570, 470, 55, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(900, 460, 40, 110);
        ctx.beginPath();
        ctx.arc(920, 460, 58, 0, Math.PI * 2);
        ctx.fill();
      }

      if (questions[currentIndex]) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 30, canvas.width, 80);
        ctx.fillStyle = "white";
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(questions[currentIndex].content, canvas.width / 2, 80);
      }

      if (imagesRef.current.basket.complete && imagesRef.current.basket.naturalWidth > 0) {
        ctx.drawImage(imagesRef.current.basket, basket.x, basket.y, basket.width, basket.height);
      } else {
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
        ctx.fillStyle = "#A0522D";
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height * 0.3);
        ctx.strokeStyle = "#654321";
        ctx.lineWidth = 3;
        for (let i = 0; i < basket.width; i += 12) {
          ctx.beginPath();
          ctx.moveTo(basket.x + i, basket.y);
          ctx.lineTo(basket.x + i, basket.y + basket.height);
          ctx.stroke();
        }
      }

      let allApplesFallen = true;
      apples.forEach((apple, idx) => {
        apple.y += apple.speed;

        if (imagesRef.current.apple.complete && imagesRef.current.apple.naturalWidth > 0) {
          ctx.drawImage(imagesRef.current.apple, apple.x, apple.y, apple.width, apple.height);
        } else {
          ctx.fillStyle = "#DC143C";
          ctx.beginPath();
          ctx.arc(apple.x + apple.width / 2, apple.y + apple.height / 2, apple.width / 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#FFB6C1";
          ctx.beginPath();
          ctx.arc(apple.x + apple.width / 3, apple.y + apple.height / 3, apple.width / 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#8B4513";
          ctx.fillRect(apple.x + apple.width / 2 - 3, apple.y, 6, 15);

          ctx.fillStyle = "#228B22";
          ctx.beginPath();
          ctx.ellipse(apple.x + apple.width / 2 + 8, apple.y + 5, 10, 6, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "white";
        ctx.font = "bold 26px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeText(apple.text, apple.x + apple.width / 2, apple.y + apple.height / 2 + 8);
        ctx.fillText(apple.text, apple.x + apple.width / 2, apple.y + apple.height / 2 + 8);

        if (
          apple.y + apple.height > basket.y &&
          apple.x + apple.width > basket.x &&
          apple.x < basket.x + basket.width
        ) {
          if (apple.isCorrect) {
            setScore((prev) => prev + 10);
            apples.splice(idx, 1);
            if (apples.every((a) => !a.isCorrect) && currentIndex < questions.length - 1) {
              setCurrentIndex((prev) => prev + 1);
              initializeApples();
            } else if (apples.every((a) => !a.isCorrect) && currentIndex === questions.length - 1) {
              setTimeout(async () => {
                await handleGameComplete();
                setGameOver(true);
              }, 100);
            }
          } else {
            apples.splice(idx, 1);
            if (currentIndex < questions.length - 1) {
              setCurrentIndex((prev) => prev + 1);
              initializeApples();
            } else if (apples.length === 0) {
              setTimeout(async () => {
                await saveScore(score);
                setGameOver(true);
              }, 100);
            }
          }
        }

        if (apple.y <= canvas.height) {
          allApplesFallen = false;
        }

        if (apple.y > canvas.height) {
          apples.splice(idx, 1);
        }
      });

      if (allApplesFallen && apples.length === 0 && !gameOver) {
        initializeApples();
      }

      if (!gameOver && apples.length > 0) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [questions, currentIndex, gameOver, gameStarted]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-200 to-green-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-4xl font-bold text-gray-800">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (!lessonInfo || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-200 to-green-200">
        <p className="text-4xl font-bold text-gray-800">Không thể tải câu hỏi</p>
      </div>
    );
  }

  // Màn hình bắt đầu
  if (!gameStarted) {
    return (
      <StartScreen>
        <FloatingIcon>🍎</FloatingIcon>
        <FloatingIcon>📚</FloatingIcon>
        <FloatingIcon>🎯</FloatingIcon>
        <FloatingIcon>⭐</FloatingIcon>
        
        <StartContainer>
          <GameTitle>🍎 Game Hứng Táo</GameTitle>
          <GameSubtitle>{lessonInfo.lesson_name}</GameSubtitle>
          
          <GameStats>
            <StatItem>
              <span className="stat-value">{questions.length}</span>
              <div className="stat-label">Câu hỏi</div>
            </StatItem>
            <StatItem>
              <span className="stat-value">{getSymbol(operation)}</span>
              <div className="stat-label">Phép toán</div>
            </StatItem>
            <StatItem>
              <span className="stat-value">10</span>
              <div className="stat-label">Điểm/câu</div>
            </StatItem>
          </GameStats>
          
          <GameDescription>
            🎮 Di chuyển chuột để điều khiển giỏ và hứng những quả táo có đáp án đúng!<br/>
            🏆 Trả lời đúng tất cả câu hỏi để hoàn thành bài học!
          </GameDescription>
          
          <StartButton onClick={startGame}>
            🚀 Bắt đầu chơi
          </StartButton>
        </StartContainer>
      </StartScreen>
    );
  }

  if (gameOver) {
    const isGameCompleted = score >= questions.length * 10;
    
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-200 to-green-200">
        <h2 className="text-6xl font-bold text-gray-800 mb-6">{lessonInfo.lesson_name}</h2>
        <p className="text-5xl text-gray-700 mb-4">Điểm số: {score}</p>
        <p className="text-4xl mb-8">
          {isGameCompleted ? "🎉 Chúc mừng! Bạn đã hoàn thành bài học!" : "❌ Game Over!"}
        </p>
        {isGameCompleted && (
          <p className="text-2xl text-green-600 mb-4 font-semibold">
            ✅ Điểm của bạn đã được lưu thành công!
          </p>
        )}
        <div className="flex gap-4">
          <button
            onClick={async () => {
              setScore(0);
              setCurrentIndex(0);
              setGameOver(false);
              setGameStarted(false);
            }}
            className="px-10 py-5 bg-blue-600 text-white text-2xl font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Chơi lại
          </button>
          <button
            onClick={() => navigate('..')}
            className="px-10 py-5 bg-gray-600 text-white text-2xl font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            Về menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-green-200 p-6">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-5xl font-bold text-center text-gray-800 mb-6">{lessonInfo.lesson_name}</h2>
        <div className="flex justify-between text-2xl text-gray-700 mb-6">
          <p>
            Phép toán: <span className="font-semibold">{getSymbol(operation)}</span>
          </p>
          <p>
            Điểm: <span className="font-semibold">{score}</span>
          </p>
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={1400}
            height={600}
            className="w-full h-auto border-2 border-gray-300 rounded-lg shadow-md"
          />
          <EndGameButton onClick={endGame}>Kết thúc game</EndGameButton>
        </div>
        <p className="text-center text-2xl text-gray-600 mt-6">
          Di chuyển chuột để điều khiển giỏ hứng táo đúng
        </p>
      </div>
    </div>
  );
}

function getSymbol(operation) {
  switch (operation) {
    case "cộng":
      return "+";
    case "trừ":
      return "-";
    case "nhân":
      return "×";
    case "chia":
      return "÷";
    case "hỗn hợp":
      return "±";
    default:
      return "?";
  }
}