import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function DangNhap({ setUsername }) {
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      setUsername(res.data.username);
      toast.success(`✅ Xin chào ${res.data.username}`);
      navigate("/");
    } catch (err) {
      toast.error("❌ Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 30 }}>
      <h2>🔐 Đăng nhập</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsernameInput(e.target.value)}
          style={{ padding: 10 }}
        />
        <input
          placeholder="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10 }}
        />
        <button
          type="submit"
          style={{
            background: "#4CAF50",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Đăng nhập
        </button>
      </form>
      <p style={{ marginTop: 15 }}>
        Bạn chưa có tài khoản?{" "}
        <Link
          to="/register"
          style={{ color: "#007bff", textDecoration: "none" }}
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
