import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// Keyframes for animations
const confettiAnimation = keyframes`
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
`;

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

const sparkleAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(0) rotate(360deg);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #e6f3ff, #f3e8ff);
  padding: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
`;

const ProgressBar = styled.div`
  width: 100%;
  background: #e5e7eb;
  border-radius: 9999px;
  height: 12px;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  height: 12px;
  border-radius: 9999px;
  background: linear-gradient(to right, ${(props) => props.color});
  transition: width 0.5s ease-in-out;
`;

const QuestionCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 32px;
  margin-bottom: 24px;
`;

const QuestionContent = styled.div`
  display: inline-block;
  background: linear-gradient(to right, ${(props) => props.color});
  color: white;
  padding: 16px 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AnswerButton = styled.button`
  position: relative;
  padding: 24px;
  border-radius: 16px;
  font-size: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  transform: ${(props) => (props.isAnimating ? "scale(1.05)" : "scale(1)")};
  background: ${(props) =>
    props.isCorrect ? "#f0fff4" : props.isWrong ? "#fef2f2" : "#f9fafb"};
  color: ${(props) =>
    props.isCorrect ? "#15803d" : props.isWrong ? "#b91c1c" : "#374151"};
  border: 2px solid
    ${(props) =>
      props.isCorrect ? "#4ade80" : props.isWrong ? "#f87171" : "#e5e7eb"};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: scale(1.05);
    border-color: ${(props) =>
      !props.disabled && !props.isCorrect && !props.isWrong ? "#93c5fd" : ""};
    background: ${(props) =>
      !props.disabled && !props.isCorrect && !props.isWrong ? "#eff6ff" : ""};
  }
`;

const Feedback = styled.div`
  display: inline-block;
  padding: 12px 24px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  background: ${(props) => (props.isCorrect ? "#f0fff4" : "#fef2f2")};
  color: ${(props) => (props.isCorrect ? "#15803d" : "#b91c1c")};
`;

const CompletedContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  position: relative;
  overflow: hidden;
`;

const CompletedCard = styled.div`
  max-width: 448px;
  width: 100%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  padding: 32px;
  text-align: center;
  position: relative;
  z-index: 10;
  animation: ${bounceAnimation} 1s ease-out;
`;

const CelebrationTitle = styled.h2`
  font-size: 30px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
  animation: ${pulseAnimation} 2s infinite;
`;

const TrophyIcon = styled.div`
  font-size: 80px;
  margin-bottom: 16px;
  animation: ${bounceAnimation} 2s infinite;
`;

const ScoreDisplay = styled.div`
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
`;

const Sparkle = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #fff, transparent);
  border-radius: 50%;
  animation: ${sparkleAnimation} 2s infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

const Confetti = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: ${props => props.color};
  animation: ${confettiAnimation} 3s linear infinite;
  animation-delay: ${props => props.delay || '0s'};
  left: ${props => props.left || '50%'};
`;

const RetryButton = styled.button`
  width: 100%;
  background: linear-gradient(to right, #3b82f6, #7c3aed);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  &:hover {
    background: linear-gradient(to right, #2563eb, #6d28d9);
    transform: scale(1.05);
  }
`;

const EndGameButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;

  &:hover {
    background-color: #ff0000;
    transform: scale(1.05);
  }
`;

const CelebrationBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

export default function Game1({ lessonId, lessonName, operation, level }) {
  const [questions, setQuestions] = useState([]);
  const [lessonInfo, setLessonInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
<<<<<<< HEAD
  const username = localStorage.getItem('username');
=======
  const username = localStorage.getItem("username"); // Giả sử username được lưu trong localStorage
>>>>>>> 90482692382abf4a8daafe6dbe91197bea0dc2bb

  const saveScore = async (additionalScore) => {
    console.log(`Đang lưu điểm: ${additionalScore}`);

    try {
      const response = await fetch("http://localhost:5000/api/score/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          score: additionalScore,
<<<<<<< HEAD
          action: 'add'
=======
          action: "add", // Thêm điểm vào điểm hiện có
>>>>>>> 90482692382abf4a8daafe6dbe91197bea0dc2bb
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi lưu điểm");
      }
      return data;
    } catch (error) {
      console.error("Lỗi khi lưu điểm:", error);
      return null;
    }
  };

  const endGame = async () => {
<<<<<<< HEAD
    if (window.confirm("Bạn có chắc muốn kết thúc game? Điểm của bạn sẽ được lưu lại.")) {
      const finalScore = score * 10;
=======
    if (
      window.confirm(
        "Bạn có chắc muốn kết thúc game? Điểm của bạn sẽ được lưu lại."
      )
    ) {
      const finalScore = score * 10; // Giả sử mỗi câu đúng được 10 điểm
>>>>>>> 90482692382abf4a8daafe6dbe91197bea0dc2bb
      await saveScore(finalScore);
      navigate("..");
    }
  };

  const completeGame = async () => {
    setIsCompleted(true);
    const finalScore = score * 10; // Chỉ tính điểm từ câu trả lời đúng

    console.log("📊 Tổng điểm:", finalScore);

    if (finalScore > 0) {
      await saveScore(finalScore);
    }

    // Bỏ alert, để celebration tự nói lên tất cả
  };

<<<<<<< HEAD
  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCompleted(false);
    setFeedback("");
    setIsAnimating(false);
=======
    alert(
      `🎉 Bạn đã hoàn thành bài học! Tổng điểm: ${finalScore + bonusPoints}`
    );
>>>>>>> 90482692382abf4a8daafe6dbe91197bea0dc2bb
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/questions/lesson/${lessonId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setLessonInfo(data.lessonInfo);
      })
      .catch((err) => console.error("Lỗi khi lấy câu hỏi:", err));
  }, [lessonId]);

  // Create confetti pieces
  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const confettiPieces = [];
    
    for (let i = 0; i < 50; i++) {
      confettiPieces.push(
        <Confetti
          key={i}
          color={colors[Math.floor(Math.random() * colors.length)]}
          left={`${Math.random() * 100}%`}
          delay={`${Math.random() * 3}s`}
        />
      );
    }
    
    return confettiPieces;
  };

  if (!lessonInfo || questions.length === 0) {
    return (
      <Container>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              animation: "spin 1s linear infinite",
              borderRadius: "50%",
              height: "48px",
              width: "48px",
              border: "2px solid transparent",
              borderBottomColor: "#3b82f6",
              margin: "0 auto 16px",
            }}
          ></div>
          <p style={{ color: "#4b5563", fontSize: "18px" }}>
            Đang tải câu hỏi...
          </p>
        </div>
      </Container>
    );
  }

  const question = questions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setIsAnimating(true);

    setTimeout(() => {
      const isCorrect = answer === question.correct_answer;

      if (isCorrect) {
        setScore(score + 1);
        setFeedback("✅ Chính xác! Tuyệt vời!");
      } else {
        setFeedback(`❌ Sai rồi! Đáp án đúng là: ${question.correct_answer}`);
      }

      setShowResult(true);
      setIsAnimating(false);

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setFeedback("");
        } else {
          completeGame();
        }
      }, 2000);
    }, 500);
  };

  // … trong Game1 component …

// 1. Hiển thị ký hiệu
const getSymbol = (operation) => {
  switch (operation) {
    case "cộng":      return "+";
    case "trừ":       return "−";
    case "nhân":      return "×";
    case "chia":      return "÷";
    case "hỗn hợp":   return "±";
    default:          return "?";
  }
};

// 2. Chọn màu sắc theo phép
const getOperationColor = (operation) => {
  switch (operation) {
    case "cộng":      return "#4ade80, #3b82f6";   // xanh lá → xanh dương
    case "trừ":       return "#f87171, #f472b6";   // đỏ → hồng
    case "nhân":      return "#c084fc, #6366f1";   // tím nhạt → tím đậm
    case "chia":      return "#fb923c, #ef4444";   // cam nhạt → cam đậm
    case "hỗn hợp":   return "#2dd4bf, #22d3ee";   // xanh ngọc → xanh biển
    default:          return "#9ca3af, #6b7280";   // xám
  }
};

// 3. Emoji minh hoạ
const getOperationEmoji = (operation) => {
  switch (operation) {
    case "cộng":      return "➕";
    case "trừ":       return "➖";
    case "nhân":      return "✖️";
    case "chia":      return "➗";
    case "hỗn hợp":   return "🔄";
    default:          return "🎯";
  }
};


  const getCelebrationMessage = () => {
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage === 100) return "🌟 HOÀN HẢO! Bạn là thiên tài!";
    if (percentage >= 90) return "🎊 XUẤT SẮC! Thật tuyệt vời!";
    if (percentage >= 80) return "🎉 TỐT LẮM! Bạn đã làm rất tốt!";
    if (percentage >= 70) return "👏 KHÁ TỐT! Tiếp tục cố gắng!";
    if (percentage >= 60) return "👍 ĐƯỢC RỒI! Bạn đã cố gắng!";
    return "💪 CỐ GẮNG HỌC THÊM! Bạn sẽ giỏi hơn!";
  };

  if (isCompleted) {
    return (
      <CompletedContainer>
        <CelebrationBackground>
          {createConfetti()}
        </CelebrationBackground>
        
        <CompletedCard>
<<<<<<< HEAD
          <TrophyIcon>🏆</TrophyIcon>
          <CelebrationTitle>
            CHÚC MỪNG!
          </CelebrationTitle>
          <p style={{ color: "#4b5563", fontSize: "18px", marginBottom: "24px" }}>
            {getCelebrationMessage()}
          </p>

          <ScoreDisplay>
            <Sparkle delay="0s" style={{ top: '10px', left: '10px' }} />
            <Sparkle delay="0.5s" style={{ top: '20px', right: '20px' }} />
            <Sparkle delay="1s" style={{ bottom: '10px', left: '30px' }} />
            <Sparkle delay="1.5s" style={{ bottom: '20px', right: '10px' }} />
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "48px", marginRight: "12px" }}>⭐</span>
              <span style={{ fontSize: "36px", fontWeight: "bold", color: "#1f2937" }}>
=======
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏆</div>
            <h2
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "8px",
              }}
            >
              🎉 Hoàn thành!
            </h2>
            <p style={{ color: "#4b5563" }}>Bạn đã hoàn thành bài học</p>
          </div>

          <div
            style={{
              background: "linear-gradient(to right, #fefce8, #ffedd5)",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "36px", marginRight: "8px" }}>⭐</span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1f2937",
                }}
              >
>>>>>>> 90482692382abf4a8daafe6dbe91197bea0dc2bb
                {score}/{questions.length}
              </span>
            </div>
            
            <div style={{ fontSize: "16px", color: "#4b5563", marginBottom: "8px" }}>
              Tỉ lệ chính xác: {Math.round((score / questions.length) * 100)}%
            </div>
            
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#d63031" }}>
              Điểm số: {score * 10} điểm
            </div>
          </ScoreDisplay>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>
              {score === questions.length ? "🎊🎉🎊" : 
               score >= questions.length * 0.8 ? "🎉🎈🎉" : 
               score >= questions.length * 0.6 ? "🎈👏🎈" : "💪🌟💪"}
            </div>
            <p style={{ fontSize: "16px", color: "#6b7280" }}>
              Bạn đã hoàn thành bài học "{lessonInfo.lesson_name}"
            </p>
          </div>

          <RetryButton onClick={resetGame}>
            🔄 Làm lại để đạt điểm cao hơn
          </RetryButton>
        </CompletedCard>
      </CompletedContainer>
    );
  }

  return (
    <Container>
      <EndGameButton onClick={endGame}>Kết thúc game</EndGameButton>
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        {/* Header */}
        <Card>
          <Header>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "30px" }}>📚</div>
              <div>
                <Title>{lessonInfo.lesson_name}</Title>
                <p
                  style={{
                    color: "#4b5563",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>🎯</span>
                  Phép toán:{" "}
                  <span style={{ fontWeight: "600", marginLeft: "4px" }}>
                    {getSymbol(lessonInfo.operation)}{" "}
                    {getOperationEmoji(lessonInfo.operation)}
                  </span>
                  <span
                    style={{
                      marginLeft: "12px",
                      background: "#dbeafe",
                      color: "#1e40af",
                      padding: "4px 8px",
                      borderRadius: "9999px",
                      fontSize: "14px",
                    }}
                  >
                    Level {lessonInfo.level}
                  </span>
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>Điểm số</div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#2563eb",
                }}
              >
                {score}/{questions.length}
              </div>
            </div>
          </Header>

          {/* Progress Bar */}
          <ProgressBar>
            <ProgressFill
              color={getOperationColor(lessonInfo.operation)}
              style={{ width: `${progressPercentage}%` }}
            />
          </ProgressBar>
          <div
            style={{ textAlign: "center", fontSize: "14px", color: "#4b5563" }}
          >
            Câu hỏi {currentIndex + 1} / {questions.length}
          </div>
        </Card>

        {/* Question Card */}
        <QuestionCard>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <QuestionContent color={getOperationColor(lessonInfo.operation)}>
              <span style={{ fontSize: "36px", fontWeight: "bold" }}>
                {question.content}
              </span>
            </QuestionContent>
          </div>

          {/* Answer Options */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              maxWidth: "512px",
              margin: "0 auto",
            }}
          >
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.correct_answer;
              const isWrong = showResult && isSelected && !isCorrect;
              const showCorrect = showResult && isCorrect;

              return (
                <AnswerButton
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult || isAnimating}
                  isAnimating={isAnimating && isSelected}
                  isCorrect={showCorrect}
                  isWrong={isWrong}
                >
                  <span style={{ position: "relative", zIndex: 10 }}>
                    {option}
                  </span>
                  {showCorrect && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        fontSize: "24px",
                      }}
                    >
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        fontSize: "24px",
                      }}
                    >
                      ❌
                    </div>
                  )}
                </AnswerButton>
              );
            })}
          </div>

          {/* Feedback */}
          {showResult && (
            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <Feedback isCorrect={feedback.includes("✅")}>
                {feedback}
              </Feedback>
              {currentIndex < questions.length - 1 && (
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4b5563",
                  }}
                >
                  <span
                    style={{
                      marginRight: "8px",
                      animation: "pulse 1s infinite",
                    }}
                  >
                    ➡️
                  </span>
                  <span>Tự động chuyển câu tiếp theo...</span>
                </div>
              )}
            </div>
          )}
        </QuestionCard>
      </div>
    </Container>
  );
}
