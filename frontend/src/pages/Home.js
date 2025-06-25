export default function Home({ username }) {
  return (
    <div>
      <h1>🏠 Trang chủ</h1>
      {username ? (
        <p>Xin chào, <strong>{username}</strong>!</p>
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
