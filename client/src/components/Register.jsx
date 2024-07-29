import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

const Register = ({ onBackToLoginClick }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('danger');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/auth/register', { name, phoneNumber, password });
      setMessage('Registration successful. Please login.');
      setVariant('success');
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
      setVariant('danger');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Register</h2>
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              style={styles.input}
            />
          </Form.Group>
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
          <Button onClick={handleRegister} style={styles.button}>
            Register
          </Button>
        </Form>
        {message && <Alert variant={variant} className="mt-3">{message}</Alert>}
        <p style={styles.link}>
          Already have an account? <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={onBackToLoginClick}>Login here</span>
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

export default Register;
