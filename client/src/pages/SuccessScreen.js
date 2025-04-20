import React from 'react';
import { Container } from 'react-bootstrap';

function SuccessScreen({ message }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #b3b6ff, #7a7dff)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0',
      }}
    >
      <Container className="text-center">
        <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '20px' }}>
          {message}
        </h2>
        <p style={{ color: '#fff', fontSize: '1.2rem' }}>
          Đang chuyển hướng...
        </p>
      </Container>
    </div>
  );
}

export default SuccessScreen;