import React, { useState, useEffect } from 'react';

export default function Home({ username }) {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState('United-1.html');

  // Danh sách các game có sẵn
  const games = [
    { name: 'United Game 1', file: 'United-1.html', emoji: '🎮' },
    { name: 'Untitled Game', file: 'Untitled-1.html', emoji: '🕹️' },
    { name: 'Phép Chia Bảng Cửu Cửu', file: 'PhepChiaBangCuuCuu.html', emoji: '➗' },
    { name: 'Phép Trừ Hai Chữ Số', file: 'PhepTruHaiChuSo.html', emoji: '➖' },
    { name: 'Phép Trừ Một Chữ Số', file: 'PhepTruMotChuSo.html', emoji: '✖️' }
  ];

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

  const handleGameSelect = (gameFile) => {
    setSelectedGame(gameFile);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>🏠 Trang chủ</h1>
      
      {/* Thông tin người dùng */}
      {username ? (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
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
        <p style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffe6e6', borderRadius: '8px', color: '#d63031' }}>
          Vui lòng đăng nhập để chơi game và lưu điểm.
        </p>
      )}

      {/* Chọn game */}
      <div style={{ marginBottom: '20px' }}>
        <h2>🎯 Chọn Game</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {games.map((game, index) => (
            <button
              key={index}
              onClick={() => handleGameSelect(game.file)}
              style={{
                padding: '10px 15px',
                border: selectedGame === game.file ? '2px solid #0066cc' : '2px solid #ddd',
                borderRadius: '8px',
                backgroundColor: selectedGame === game.file ? '#e6f2ff' : '#fff',
                color: selectedGame === game.file ? '#0066cc' : '#333',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: selectedGame === game.file ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (selectedGame !== game.file) {
                  e.target.style.backgroundColor = '#f0f0f0';
                }
              }}
              onMouseOut={(e) => {
                if (selectedGame !== game.file) {
                  e.target.style.backgroundColor = '#fff';
                }
              }}
            >
              {game.emoji} {game.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hiển thị game đã chọn */}
      <div style={{ marginTop: '20px' }}>
        <h3>🎮 Game hiện tại: {games.find(g => g.file === selectedGame)?.name}</h3>
        <div style={{ 
          height: '700px', 
          border: '2px solid #ddd', 
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <iframe
            src={`/${selectedGame}`}
            title={games.find(g => g.file === selectedGame)?.name || "Game"}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </div>
      </div>

      {/* Hướng dẫn */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e8f4fd', 
        borderRadius: '8px',
        borderLeft: '4px solid #0066cc'
      }}>
        <h4>📋 Hướng dẫn:</h4>
        <ul style={{ marginLeft: '20px' }}>
          <li>Chọn game bạn muốn chơi từ danh sách trên</li>
          <li>Game sẽ được tải trong khung bên dưới</li>
          <li>Điểm số của bạn sẽ được lưu tự động (nếu đã đăng nhập)</li>
          <li>Bạn có thể chuyển đổi giữa các game bất cứ lúc nào</li>
        </ul>
      </div>
    </div>
  );
}