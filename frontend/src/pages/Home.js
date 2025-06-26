import React, { useState, useEffect } from 'react';

export default function Home({ username }) {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      const fetchScore = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/auth/get-score/${username}`);
          const data = await response.json();
          if (response.ok) {
            setScore(data.score);
          } else {
            setError(data.message);
          }
        } catch (err) {
          setError('Lỗi khi lấy điểm');
          console.error('Error fetching score:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchScore();
    } else {
      setLoading(false);
    }
  }, [username]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>🏠 Trang chủ</h1>
      {username ? (
        <div>
          <p>Xin chào, <strong>{username}</strong>!</p>
          {loading ? (
            <p>Đang tải điểm...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <p>Điểm của bạn: <strong>{score !== null ? score : '0'}</strong></p>
          )}
        </div>
      ) : (
        <p>Vui lòng đăng nhập.</p>
      )}

      {/* Nhúng game */}
      <div style={{ marginTop: '20px', height: '700px' }}>
        <iframe
          src="/United-1.html"
          title="United Game"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
}