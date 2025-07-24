import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // nếu bạn dùng React Router

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

export default function Game1({ lessonId, lessonName, operation, level }) {
  const [questions, setQuestions] = useState([]);
  const [lessonInfo, setLessonInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);
  const basketRef = useRef({ x: 0, y: 0, width: 120, height: 60 });
  const applesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const imagesRef = useRef({});
  const navigate = useNavigate(); // dùng để chuyển trang
  const username = localStorage.getItem('username'); // Giả sử username được lưu trong localStorage

  const saveScore = async (additionalScore) => {
    console.log(`Đang lưu điểm: ${additionalScore}`);

    try {
      const response = await fetch('http://210.245.52.119/api_gametoanhoc/api/score/save', {
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

  images.apple.src = "/gametinhtoan/images/apple.png";

  images.basket.src = "/gametinhtoan/images/socket.png";
  images.background.src = "/gametinhtoan/images/background.png";

  imagesRef.current = images;
};

    loadImages();
  }, []);

  useEffect(() => {
    fetch(`http://210.245.52.119/api_gametoanhoc/api/questions/lesson/${lessonId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setLessonInfo(data.lessonInfo);
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
    basket.y = canvas.height - basket.height - 20;

    const initializeApples = () => {
      apples.length = 0;
      const question = questions[currentIndex];
      question.options.forEach((option, idx) => {
        apples.push({
          x: 100 + idx * 200,
          y: 0,
          width: 60,
          height: 60,
          text: option,
          speed: 0.8 + Math.random() * 0.4,
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
        ctx.fillRect(150, 400, 30, 100);
        ctx.beginPath();
        ctx.arc(165, 400, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(450, 420, 30, 80);
        ctx.beginPath();
        ctx.arc(465, 420, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(750, 410, 30, 90);
        ctx.beginPath();
        ctx.arc(765, 410, 48, 0, Math.PI * 2);
        ctx.fill();
      }

      if (questions[currentIndex]) {
  const question = questions[currentIndex];
  if (question.question_type === "image") {
    const img = new Image();
    img.src = `/gametinhtoan/images/${question.content}`;

    img.onload = () => {
      const imgWidth = 200;
      const imgHeight = 100;
      const x = canvas.width / 2 - imgWidth / 2;
      const y = 30;
      ctx.drawImage(img, x, y, imgWidth, imgHeight);
    };
  } else {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 20, canvas.width, 60);
    ctx.fillStyle = "white";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(question.content, canvas.width / 2, 60);
  }
}


      if (imagesRef.current.basket.complete && imagesRef.current.basket.naturalWidth > 0) {
        ctx.drawImage(imagesRef.current.basket, basket.x, basket.y, basket.width, basket.height);
      } else {
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
        ctx.fillStyle = "#A0522D";
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height * 0.3);
        ctx.strokeStyle = "#654321";
        ctx.lineWidth = 2;
        for (let i = 0; i < basket.width; i += 10) {
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
          ctx.arc(apple.x + apple.width / 3, apple.y + apple.height / 3, apple.width / 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#8B4513";
          ctx.fillRect(apple.x + apple.width / 2 - 2, apple.y, 4, 10);

          ctx.fillStyle = "#228B22";
          ctx.beginPath();
          ctx.ellipse(apple.x + apple.width / 2 + 5, apple.y + 3, 8, 4, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "white";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeText(apple.text, apple.x + apple.width / 2, apple.y + apple.height / 2 + 5);
        ctx.fillText(apple.text, apple.x + apple.width / 2, apple.y + apple.height / 2 + 5);

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
              setGameOver(true);
            }
          } else {
            apples.splice(idx, 1);
            if (currentIndex < questions.length - 1) {
              setCurrentIndex((prev) => prev + 1);
              initializeApples();
            } else if (apples.length === 0) {
              setGameOver(true);
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
        <p className="text-2xl font-bold text-gray-800">Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-200 to-green-200">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{lessonInfo.lesson_name}</h2>
        <p className="text-3xl text-gray-700 mb-2">Điểm số: {score}</p>
        <p className="text-2xl mb-6">
          {score >= questions.length * 10 ? "🎉 Bạn đã hoàn thành bài học!" : "❌ Game Over!"}
        </p>
        <button
          onClick={() => {
            setScore(0);
            setCurrentIndex(0);
            setGameOver(false);
          }}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Chơi lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-green-200 p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{lessonInfo.lesson_name}</h2>
        <div className="flex justify-between text-lg text-gray-700 mb-4">
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
            width={1000}
            height={600}
            className="w-full h-auto border-2 border-gray-300 rounded-lg shadow-md"
          />
          <EndGameButton onClick={endGame}>Kết thúc game</EndGameButton>
        </div>
        <p className="text-center text-lg text-gray-600 mt-4">
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
