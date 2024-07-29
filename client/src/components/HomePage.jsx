import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Login from './Login';
import Register from './Register';

const HomePage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleBackToLoginClick = () => {
    setIsRegistering(false);
  };

  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
    },
    leftCol: {
      backgroundImage: 'url("https://cdn.siasat.com/wp-content/uploads/2023/06/indigo.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      height: '100vh',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    rightCol: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '20px',
    },
  };

  return (
    <Container fluid style={styles.container}>
      <Row style={{ flex: 1, height: '100%' }}>
        <Col md={6} style={styles.leftCol}>
          <div style={styles.overlay}>
            <h1>Welcome to Flight Tracker</h1>
            <p>Track your flights and stay updated with real-time information.</p>
          </div>
        </Col>
        <Col md={6} style={styles.rightCol}>
          {isRegistering ? (
            <div>
              <Register onBackToLoginClick={handleBackToLoginClick} />
            </div>
          ) : (
            <div>
              <Login onRegisterClick={handleRegisterClick} />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
