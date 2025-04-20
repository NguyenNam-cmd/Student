import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import SuccessScreen from './SuccessScreen';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, studentId, academicYear, phone }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(
          data.message === 'User already exists'
            ? 'Email đã được sử dụng. Vui lòng chọn email khác.'
            : 'Đã xảy ra lỗi. Vui lòng thử lại.'
        );
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
    }
  };

  if (showSuccess) {
    return <SuccessScreen message="Đăng ký thành công!" />;
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #b3b6ff, #7a7dff)', minHeight: '100vh', padding: '20px 0' }}>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card style={{ width: '400px', padding: '20px', borderRadius: '15px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Đăng ký sinh viên</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-person me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                  <Form.Control
                    type="text"
                    placeholder="Họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0' }}
                  />
                </div>
              </Form.Group>
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
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-card-text me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                  <Form.Control
                    type="text"
                    placeholder="Mã số sinh viên (không bắt buộc)"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0' }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                  <Form.Control
                    type="text"
                    placeholder="Năm học (VD: 2023)"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0' }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-telephone me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                  <Form.Control
                    type="text"
                    placeholder="Số điện thoại (VD: 0123-456-789)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                Đăng ký ngay
              </Button>
            </Form>
            <div className="text-center mt-3">
              <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Register;