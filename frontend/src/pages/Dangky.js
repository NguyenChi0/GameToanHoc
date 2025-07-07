import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function DangKy() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { username, password });
      toast.success("🎉 Đăng ký thành công!");
      navigate("/login"); // 👉 Chuyển hướng NGAY
    } catch (err) {
      toast.error("❌ Đăng ký thất bại");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 30 }}>
      <h2>📝 Đăng ký</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
            background: "#2196F3",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Đăng ký
        </button>
      </form>
      <p style={{ marginTop: 15 }}>
        Đã có tài khoản?{" "}
        <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  );
}
