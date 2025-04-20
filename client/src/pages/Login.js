import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import SuccessScreen from './SuccessScreen'; // Import the SuccessScreen component

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // State to control success screen
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setShowSuccess(true); // Show the success screen
        // Redirect based on role after 2 seconds
        setTimeout(() => {
          navigate(data.user.role === 'admin' ? '/manage-students' : '/');
        }, 2000);
      } else {
        setError(
          data.message === 'Invalid email or password'
            ? 'Email hoặc mật khẩu không đúng.'
            : 'Đã xảy ra lỗi.'
        );
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
    }
  };

  // If showSuccess is true, render the SuccessScreen
  if (showSuccess) {
    return <SuccessScreen message="Đăng nhập thành công!" />;
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #b3b6ff, #7a7dff)', minHeight: '100vh', padding: '20px 0' }}>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card style={{ width: '400px', padding: '20px', borderRadius: '15px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Đăng nhập</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-envelope me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0' }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-lock me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                  <Form.Control
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0' }}
                  />
                </div>
              </Form.Group>
              <Button
                type="submit"
                className="w-100"
                style={{
                  background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                  border: 'none',
                  borderRadius: '25px',
                }}
              >
                Đăng nhập
              </Button>
            </Form>
            <div className="text-center mt-3">
              <p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Login;