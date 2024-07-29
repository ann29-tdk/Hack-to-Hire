import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const CustomNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">Flight Tracker</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {user ? (
            <>
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" style={{"display" : "none"}}>Login</Nav.Link >
              <Nav.Link as={Link} to="/register" style={{"display" : "none"}}>Register</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
