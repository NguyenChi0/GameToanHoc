import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Import các giao diện game
import Game1 from "../games/Game1";
import Game2 from "../games/Game2";
import Game3 from "../games/Game3";
import Game4 from "../games/Game4";
function GamePage() {
  const location = useLocation();
  const { lessonId, lessonName, operation, level } = location.state || {};

  const [styleIndex, setStyleIndex] = useState(null);

  useEffect(() => {
    // Random 1 trong 3 kiểu giao diện: 0 → Game1, 1 → Game2, 2 → Game3
    const randomIndex = Math.floor(Math.random() * 4);
    setStyleIndex(randomIndex);
  }, []);

  if (!lessonId) return <p>Không tìm thấy thông tin bài học</p>;
  if (styleIndex === null) return <p>Đang tải giao diện...</p>;

  // Prop chung gửi sang Game component
  const gameProps = { lessonId, lessonName, operation, level };

  // Chọn giao diện hiển thị
  switch (styleIndex) {
    case 0:
      return <Game1 {...gameProps} />;
    case 1:
      return <Game2 {...gameProps} />;
    case 2:
      return <Game3 {...gameProps} />;
    case 3:
      return <Game4 {...gameProps} />;
    default:
      return <p>Không có giao diện phù hợp</p>;
  }
}

export default GamePage;
