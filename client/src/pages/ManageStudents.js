import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Card } from 'react-bootstrap';

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', studentId: '', password: '' });

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch('http://localhost:5000/api/admin/students');
      const data = await response.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (response.ok) {
        const addedStudent = await response.json();
        setStudents([...students, addedStudent]);
        setShowAddModal(false);
        setNewStudent({ name: '', email: '', studentId: '', password: '' });
      }
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error);
    }
  };

  const handleEditStudent = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-student/${currentStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentStudent),
      });
      if (response.ok) {
        const updatedStudent = await response.json();
        setStudents(students.map((student) => (student._id === updatedStudent._id ? updatedStudent : student)));
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-student/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStudents(students.filter((student) => student._id !== id));
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #b3b6ff, #7a7dff)', // Purple gradient
        minHeight: '100vh',
        padding: '20px 0',
      }}
    >
      <Container className="my-5">
        <Card
          style={{
            position: 'relative',
            borderRadius: '15px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            padding: '20px',
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
            <h2 className="text-center mb-4">Quản lý Sinh viên</h2>
            <Button
              className="mb-3"
              style={{
                background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 24px',
                transition: 'transform 0.2s',
              }}
              onClick={() => setShowAddModal(true)}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              <i className="bi bi-person-plus me-2"></i> Thêm Sinh viên
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mã sinh viên</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Hoạt động</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.studentId}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="me-2"
                        style={{
                          borderRadius: '20px',
                          transition: 'transform 0.2s',
                        }}
                        onClick={() => {
                          setCurrentStudent(student);
                          setShowEditModal(true);
                        }}
                        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                      >
                        <i className="bi bi-pencil me-1"></i> Chỉnh sửa
                      </Button>
                      <Button
                        variant="danger"
                        style={{
                          borderRadius: '20px',
                          transition: 'transform 0.2s',
                        }}
                        onClick={() => handleDeleteStudent(student._id)}
                        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                      >
                        <i className="bi bi-trash me-1"></i> Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Add Student Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
          <Modal.Header closeButton style={{ border: 'none' }}>
            <Modal.Title>Thêm Sinh viên</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-person me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
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
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0' }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-person-badge me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                  <Form.Control
                    type="text"
                    placeholder="Student ID"
                    value={newStudent.studentId}
                    onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0' }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-lock me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0' }}
                  />
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ border: 'none' }}>
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              style={{
                borderRadius: '20px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleAddStudent}
              style={{
                background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                border: 'none',
                borderRadius: '20px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Add Student
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Student Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton style={{ border: 'none' }}>
            <Modal.Title>Edit Student</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentStudent && (
              <Form>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      value={currentStudent.name}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
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
                      value={currentStudent.email}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                      style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0' }}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person-badge me-2" style={{ fontSize: '1.5rem', color: '#7a7dff' }}></i>
                    <Form.Control
                      type="text"
                      placeholder="Student ID"
                      value={currentStudent.studentId}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, studentId: e.target.value })}
                      style={{ border: 'none', borderBottom: '1px solid #ccc', borderRadius: '0' }}
                    />
                  </div>
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer style={{ border: 'none' }}>
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              style={{
                borderRadius: '20px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleEditStudent}
              style={{
                background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                border: 'none',
                borderRadius: '20px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Lưu 
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default ManageStudents;