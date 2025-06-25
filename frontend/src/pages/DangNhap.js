import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function DangNhap({ setUsername }) {
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      setUsername(res.data.username);
      alert(`Welcome, ${res.data.username}`);
      navigate('/');
    } catch (err) {
      alert('Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input placeholder="Username" value={username} onChange={e => setUsernameInput(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
