import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import Admin from './components/Admin';
import CustomNavbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  return (
    <>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
