import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import DangNhap from "./pages/DangNhap";
import DangKy from "./pages/Dangky";
import Admin from "./pages/Admin";

function App() {
  const [username, setUsername] = useState(null);

  // Kiểm tra localStorage khi load lại trang
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    window.location.href = "/"; // reload lại trang về home
  };

  return (
    <BrowserRouter>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">Trang chủ</Link> |{" "}
        {!username ? (
          <>
            <Link to="/login">Đăng nhập</Link> |{" "}
            <Link to="/register">Đăng ký</Link>
          </>
        ) : (
          <>
            <span>
              Xin chào, <strong>{username}</strong>!
            </span>{" "}
            | <button onClick={handleLogout}>Đăng xuất</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home username={username} />} />
        <Route path="/login" element={<DangNhap setUsername={setUsername} />} />
        <Route path="/register" element={<DangKy />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
