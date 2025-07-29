import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import API from "../api";

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
  const canvasRef = useRef(null);
  const basketRef = useRef({ x: 0, y: 0, width: 150, height: 75 }); // Tăng kích thước basket
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
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, [lessonId]);

  useEffect(() => {
    if (questions.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const basket = basketRef.current;
    const apples = applesRef.current;

    basket.x = canvas.width / 2 - basket.width / 2;
    basket.y = canvas.height - basket.height +180;

    const initializeApples = () => {
      apples.length = 0;
      const question = questions[currentIndex];
      question.options.forEach((option, idx) => {
        apples.push({
          x: 120 + idx * 250, // Tăng khoảng cách giữa các táo
          y: 0,
          width: 80, // Tăng kích thước táo
          height: 80,
          text: option,
          speed: 1.0 + Math.random() * 0.5, // Tăng tốc độ rơi
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

        // Vẽ cây to hơn
        ctx.fillStyle = "#228B22";
        ctx.fillRect(180, 450, 40, 120); // Cây 1
        ctx.beginPath();
        ctx.arc(200, 450, 60, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(550, 470, 40, 100); // Cây 2
        ctx.beginPath();
        ctx.arc(570, 470, 55, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(900, 460, 40, 110); // Cây 3
        ctx.beginPath();
        ctx.arc(920, 460, 58, 0, Math.PI * 2);
        ctx.fill();
      }

      if (questions[currentIndex]) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 30, canvas.width, 80); // Tăng chiều cao khung câu hỏi
        ctx.fillStyle = "white";
        ctx.font = "bold 40px Arial"; // Tăng font size
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
        ctx.lineWidth = 3; // Tăng độ dày viền
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
          ctx.fillRect(apple.x + apple.width / 2 - 3, apple.y, 6, 15); // Tăng kích thước cuống

          ctx.fillStyle = "#228B22";
          ctx.beginPath();
          ctx.ellipse(apple.x + apple.width / 2 + 8, apple.y + 5, 10, 6, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "white";
        ctx.font = "bold 26px Arial"; // Tăng font size cho text trên táo
        ctx.textAlign = "center";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3; // Tăng độ dày viền text
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
              // Game hoàn thành - lưu điểm trước khi set gameOver
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
              // Game kết thúc không hoàn thành - vẫn lưu điểm
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
  }, [questions, currentIndex, gameOver]);

  if (!lessonInfo || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-200 to-green-200">
        <p className="text-4xl font-bold text-gray-800">Đang tải câu hỏi...</p>
      </div>
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
        <button
          onClick={async () => {
            setScore(0);
            setCurrentIndex(0);
            setGameOver(false);
          }}
          className="px-10 py-5 bg-blue-600 text-white text-2xl font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Chơi lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-green-200 p-6">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl p-8"> {/* Tăng max-width và padding */}
        <h2 className="text-5xl font-bold text-center text-gray-800 mb-6">{lessonInfo.lesson_name}</h2> {/* Tăng font size */}
        <div className="flex justify-between text-2xl text-gray-700 mb-6"> {/* Tăng font size */}
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
            width={1400} // Tăng kích thước canvas
            height={600}
            className="w-full h-auto border-2 border-gray-300 rounded-lg shadow-md"
          />
          <EndGameButton onClick={endGame}>Kết thúc game</EndGameButton>
        </div>
        <p className="text-center text-2xl text-gray-600 mt-6"> {/* Tăng font size */}
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