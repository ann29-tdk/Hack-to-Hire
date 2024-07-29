import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

const Login = ({ onRegisterClick }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { phoneNumber, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      setMessage('Login successful.');
      navigate('/dashboard');
    } catch (error) {
      setMessage('Login failed.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Login</h2>
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              style={styles.input}
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={styles.input}
            />
          </Form.Group>
          <Button onClick={handleLogin} style={styles.button}>
            Login
          </Button>
        </Form>
        {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
        <p style={styles.link}>
          Don't have an account? <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={onRegisterClick}>Register here</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  input: {
    height: '40px',
    marginBottom: '15px',
  },
  button: {
    width: '100%',
    height: '40px',
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  link: {
    marginTop: '15px',
    textAlign: 'center',
  },
};

export default Login;
