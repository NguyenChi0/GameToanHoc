import React from "react";
import { useLocation } from "react-router-dom";

export default function GamePage() {
  const location = useLocation();
  const lesson = location.state;

  if (!lesson) return <p>Không có dữ liệu bài học</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>{lesson.name}</h2>
      <iframe
        src={`/${lesson.file}`}
        title={lesson.name}
        width="100%"
        height="600"
        style={{ border: "none" }}
      />
    </div>
  );
}
