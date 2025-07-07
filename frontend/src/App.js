import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import GamePage from "./pages/GamePage";
import Home from "./pages/Home";
import DangNhap from "./pages/DangNhap";
import Dangky from "./pages/Dangky";
import Admin from "./pages/Admin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/" style={{ marginRight: 10 }}>
            🏠 Trang chủ
          </Link>
          {!username ? (
            <>
              <Link to="/login" style={{ marginRight: 10 }}>
                🔐 Đăng nhập
              </Link>
              <Link to="/register">📝 Đăng ký</Link>
            </>
          ) : (
            <>
              <span>
                👤 Xin chào, <strong>{username}</strong>
              </span>{" "}
              <button onClick={handleLogout} style={{ marginLeft: 10 }}>
                🚪 Đăng xuất
              </button>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Home username={username} />} />
          <Route
            path="/login"
            element={<DangNhap setUsername={setUsername} />}
          />
          <Route path="/register" element={<Dangky />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/game/:lessonId" element={<GamePage />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}

export default App;
