import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)', // Purple gradient
        color: '#fff',
        padding: '20px 0',
        textAlign: 'center',
        marginTop: 'auto',
      }}
    >
      <Container>
        <p>&copy; 
        Product designed by group of 11 database systems</p>
        <div className="d-flex justify-content-center gap-3">
        </div>
      </Container>
    </footer>
  );
}

export default Footer;