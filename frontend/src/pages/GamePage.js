import React from "react";
import { useLocation } from "react-router-dom";

export default function GamePage() {
  const location = useLocation();
  const { game, operation, level, lessonName } = location.state || {};

  if (!game || !operation || !level) return <p>Thiếu dữ liệu bài học</p>;

  const url = `/${game}?op=${operation}&level=${level}&lessonName=${encodeURIComponent(
    lessonName
  )}`;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>{lessonName}</h2>
      <iframe
        src={url}
        title={lessonName}
        width="100%"
        height="600"
        style={{ border: "none" }}
      />
    </div>
  );
}
