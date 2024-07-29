import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const Admin = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightDetails, setFlightDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  const fetchFlightDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/flight/${flightNumber}`);
      if (response.data) {
        setMessage('Flight exists');
        setAlertVariant('success');
        setFlightDetails(response.data);
        setShowModal(true);
      } else {
        setMessage('Flight does not exist');
        setAlertVariant('danger');
      }
    } catch (error) {
      setMessage('Error fetching flight details');
      setAlertVariant('danger');
    }
  };

  const handleUpdateFlight = async () => {
    try {
      await axios.post('http://localhost:5000/flight/update', {
        flightNumber,
        arrivalDate: flightDetails.arrivalDate,
        arrivalTime: flightDetails.arrivalTimes[flightDetails.arrivalTimes.length - 1],
        departureTime: flightDetails.departureTimes[flightDetails.departureTimes.length - 1],
        isCancelled: flightDetails.isCancelled,
        destination: flightDetails.destination,
      });
      setMessage('Update successfully');
      setAlertVariant('success');
      setShowModal(false);
    } catch (error) {
      setMessage('Update failed');
      setAlertVariant('danger');
    }
  };

  return (
    <div className="container">
      <h2>Admin</h2>
      <Form.Group controlId="flightNumber">
        <Form.Label>Flight Number</Form.Label>
        <Form.Control
          type="text"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          placeholder="Enter Flight Number"
        />
      </Form.Group>
      <Button onClick={fetchFlightDetails}>Fetch Flight</Button>
      {message && <Alert variant={alertVariant}>{message}</Alert>}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Flight Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {flightDetails && (
            <div>
              <Form.Group controlId="arrivalDate">
                <Form.Label>Arrival Date</Form.Label>
                <Form.Control
                  type="date"
                  value={flightDetails.arrivalDate ? flightDetails.arrivalDate.substring(0, 10) : ''}
                  onChange={(e) => setFlightDetails({ ...flightDetails, arrivalDate: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="arrivalTime">
                <Form.Label>Arrival Time</Form.Label>
                <Form.Control
                  type="time"
                  value={flightDetails.arrivalTimes[flightDetails.arrivalTimes.length - 1]}
                  onChange={(e) => {
                    const newArrivalTimes = [...flightDetails.arrivalTimes];
                    newArrivalTimes[newArrivalTimes.length - 1] = e.target.value;
                    setFlightDetails({ ...flightDetails, arrivalTimes: newArrivalTimes });
                  }}
                />
              </Form.Group>
              <Form.Group controlId="departureTime">
                <Form.Label>Departure Time</Form.Label>
                <Form.Control
                  type="time"
                  value={flightDetails.departureTimes[flightDetails.departureTimes.length - 1]}
                  onChange={(e) => {
                    const newDepartureTimes = [...flightDetails.departureTimes];
                    newDepartureTimes[newDepartureTimes.length - 1] = e.target.value;
                    setFlightDetails({ ...flightDetails, departureTimes: newDepartureTimes });
                  }}
                />
              </Form.Group>
              <Form.Group controlId="isCancelled">
                <Form.Check
                  type="checkbox"
                  label="Cancelled"
                  checked={flightDetails.isCancelled}
                  onChange={(e) => setFlightDetails({ ...flightDetails, isCancelled: e.target.checked })}
                />
              </Form.Group>
              <Form.Group controlId="destination">
                <Form.Label>Destination</Form.Label>
                <Form.Control
                  type="text"
                  value={flightDetails.destination}
                  onChange={(e) => setFlightDetails({ ...flightDetails, destination: e.target.value })}
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateFlight}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Admin;
