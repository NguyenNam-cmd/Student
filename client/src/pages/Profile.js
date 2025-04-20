import React, { useState } from 'react';
import {  Form, Button, Alert, Card } from 'react-bootstrap';

function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [studentId, setStudentId] = useState(user.studentId || '');
  const [academicYear, setAcademicYear] = useState(user.academicYear || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, studentId, academicYear, phone }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setMessage('Profile updated successfully!');
      } else {
        setMessage(data.message || 'Update failed.');
      }
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password) {
      setMessage('Please enter a new password.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Password changed successfully!');
        setPassword('');
      } else {
        setMessage(data.message || 'Password change failed.');
      }
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

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
          maxWidth: '500px',
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
          <h2 className="text-center mb-4">Hồ sơ</h2>
          {message && (
            <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
              {message}
            </Alert>
          )}
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group className="mb-3" controlId="formName">
              <div className="d-flex align-items-center">
                <i className="bi bi-person me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: 0 }}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <div className="d-flex align-items-center">
                <i className="bi bi-envelope me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: 0 }}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStudentId">
              <div className="d-flex align-items-center">
                <i className="bi bi-person-badge me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                <Form.Control
                  type="text"
                  placeholder="Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: 0 }}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAcademicYear">
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                <Form.Control
                  type="text"
                  placeholder="Academic Year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: 0 }}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formPhone">
              <div className="d-flex align-items-center">
                <i className="bi bi-phone me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                <Form.Control
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: 0 }}
                />
              </div>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 d-flex align-items-center justify-content-center mb-3"
              style={{
                background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                border: 'none',
                borderRadius: '25px',
                padding: '12px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Update Profile <i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </Form>
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3" controlId="formPassword">
              <div className="d-flex align-items-center">
                <i className="bi bi-lock me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                <Form.Control
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: 0 }}
                />
              </div>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 d-flex align-items-center justify-content-center"
              style={{
                background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                border: 'none',
                borderRadius: '25px',
                padding: '12px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Thay đổi mật khẩu
               <i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}

export default Profile;