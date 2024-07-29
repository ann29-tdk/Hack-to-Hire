import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:5000');

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [flightStatus, setFlightStatus] = useState(null);
  const [flightNumber, setFlightNumber] = useState('');
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      if (!loggedInUser) {
        navigate('/login');
      } else {
        try {
          const response = await axios.get(`http://localhost:5000/auth/user/${loggedInUser._id}`);
          const userData = response.data;
          setUser(userData);
          setFlightNumber(userData.flightNumber || '');
          setNotifications(userData.notifications || []);
          socket.emit('join', userData._id);
          console.log(`User ${userData._id} joined`);
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    socket.on('flightUpdate', (data) => {
      // Show toast notification
      toast.info(`Flight ${data.flight.flightNumber} has been updated.`);

      // Add notification to the user's notification list
      const newNotification = { message: data.message, date: new Date() };
      setNotifications(prevNotifications => {
        const updatedNotifications = [...prevNotifications, newNotification];
        const updatedUser = { ...user, notifications: updatedNotifications };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedNotifications;
      });

      // Fetch the flight status again to update the dashboard
      if (data.flight.flightNumber === flightNumber) {
        fetchFlightStatus(flightNumber);
      }
      console.log(`Received update for flight ${data.flight.flightNumber}`);
      console.log('Flight update data:', data.flight);
    });

    return () => {
      socket.off('flightUpdate');
    };
  }, [flightNumber, user]);

  const fetchFlightStatus = async (flightNumber) => {
    console.log(`Fetching flight status for flight number: ${flightNumber}`);
    try {
      const response = await axios.get(`http://localhost:5000/flight/${flightNumber}`);
      if (response.data) {
        console.log('Flight data:', response.data);
        setFlightStatus(response.data);
      } else {
        console.log('No flight data found.');
      }
    } catch (error) {
      console.error('Error fetching flight status:', error);
      setFlightStatus(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFlightNumberChange = (e) => {
    console.log('Flight Number Changed:', e.target.value);
    setFlightNumber(e.target.value);
  };

  const handleSearchFlight = async () => {
    console.log('Searching flight number:', flightNumber);
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      await axios.put(`http://localhost:5000/auth/user/${loggedInUser._id}/flight`, { flightNumber });
      fetchFlightStatus(flightNumber);
    } catch (error) {
      console.error('Error updating flight association:', error);
      toast.error('Failed to update flight association');
    }
  };

  const handleDeleteNotification = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/auth/user/${user._id}/notifications/${index}`);
      const updatedNotifications = notifications.filter((_, i) => i !== index);
      setNotifications(updatedNotifications);
      const updatedUser = { ...user, notifications: updatedNotifications };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  const sortedNotifications = notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="container mt-4">
      <ToastContainer />
      {user && (
        <div>
          <h2 className="mt-4"><strong>Welcome, {user.name}</strong></h2>
        </div>
      )}
      <Row>
        <Col md={6}>
          {user && (
            <div>
              <Form.Group controlId="flightNumber" className="mb-3">
                <Form.Label>Flight Number</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={flightNumber}
                    onChange={handleFlightNumberChange}
                    className="mr-2"
                    style={{ maxWidth: '150px' }}
                  />
                  <Button onClick={handleSearchFlight} className="ml-4">Search Flight</Button>
                </div>
              </Form.Group>
            </div>
          )}
          {flightStatus && (
            <div>
              <h3>Flight Status</h3>
              <p>Arrival Date: {flightStatus.arrivalDate}</p>
              <p>Latest Arrival Time: {flightStatus.latestArrivalTime}</p>
              <p>Latest Departure Time: {flightStatus.latestDepartureTime}</p>
              <p>Is Cancelled: {flightStatus.isCancelled ? 'Yes' : 'No'}</p>
              <p>Destination: {flightStatus.destination}</p>
              <p>Latest Arrival Delay: {flightStatus.latestArrivalDelay}</p>
              <p>Latest Departure Delay: {flightStatus.latestDepartureDelay}</p>
            </div>
          )}
        </Col>
        <Col md={6}>
          <h3>Notifications</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Notification</th>
                <th>Notification Time</th>
                <th>Notification Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedNotifications.map((notification, index) => (
                <tr key={index}>
                  <td>{notification.message}</td>
                  <td>{formatTime(notification.date)}</td>
                  <td>{formatDate(notification.date)}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteNotification(index)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
