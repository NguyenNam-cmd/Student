import React from 'react';
import { Card, Button } from 'react-bootstrap';

function Home() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #b3b6ff, #7a7dff)', // Purple gradient
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Diagonal Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'linear-gradient(135deg, #7a7dff, #b3b6ff)',
            clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="text-center mb-4">Chào mừng đến với Tempi của chúng tôi</h2>
          <p className="text-center mb-4">
          Quản lý các hoạt động của sinh viên, tham gia thảo luận và cập nhật những chủ đề mới nhất.
          </p>
          <div className="text-center">
            <Button
              variant="primary"
              href="/forum"
              style={{
                background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 24px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Khám phá Diễn đàn<i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Home;