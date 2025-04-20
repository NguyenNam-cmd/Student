import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, NavbarText } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import tempiLogo from '../assets/tempi-logo.png'; // Import logo

function CustomNavbar() {
  const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
  const [searchQuery, setSearchQuery] = useState(''); // State cho tìm kiếm
  const navigate = useNavigate();

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/forum?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage
    navigate('/login'); // Điều hướng về trang đăng nhập
  };

  return (
    <Navbar
      expand="lg"
      className="shadow-sm"
      style={{
        background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)', // Purple gradient
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={tempiLogo}
            alt="TEMPI Logo"
            style={{
              height: '25px', // Điều chỉnh kích thước logo
              width: 'auto',
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{ color: '#fff' }}>
              <i className="bi bi-house me-1"></i> Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/forum" style={{ color: '#fff' }}>
              <i className="bi bi-chat-square-text me-1"></i> Diễn đàn
            </Nav.Link>
            {user?.role === 'admin' && (
              <Nav.Link as={Link} to="/manage-students" style={{ color: '#fff' }}>
                <i className="bi bi-people me-1"></i> Quản lý sinh viên
              </Nav.Link>
            )}
          </Nav>
          {/* Search Bar */}
          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search topics..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: '20px' }}
            />
            <Button
              variant="outline-light"
              type="submit"
              style={{ borderRadius: '20px' }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              <i className="bi bi-search"></i>
            </Button>
          </Form>
          {/* User Links */}
          <Nav>
            {user ? (
              <>
                <NavbarText className="me-3" style={{ color: '#fff' }}>
                  Xin chào, <strong>{user.name}</strong>
                </NavbarText>
                <Nav.Link as={Link} to="/profile" style={{ color: '#fff' }}>
                  <i className="bi bi-person-circle me-1"></i> Hồ sơ
                </Nav.Link>
                <Nav.Link
                  onClick={handleLogout} // Sử dụng hàm handleLogout
                  style={{ color: '#fff' }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{ color: '#fff' }}>
                  <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                </Nav.Link>
                <Nav.Link as={Link} to="/register" style={{ color: '#fff' }}>
                  <i className="bi bi-person-plus me-1"></i> Đăng ký
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;