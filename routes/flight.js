const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const User = require('../models/User');

// Helper function to format delays
const formatDelay = (delay) => {
  if (delay > 60) {
    const hours = Math.floor(delay / 60);
    const minutes = delay % 60;
    return `${hours} hour(s) ${minutes} minute(s)`;
  }
  return `${delay} minute(s)`;
};

// Get flight details
router.get('/:flightNumber', async (req, res) => {
  const { flightNumber } = req.params;
  try {
    const flight = await Flight.findOne({ flightNumber });
    if (flight) {
      const formattedFlight = {
        ...flight._doc,
        arrivalDate: flight.arrivalDate.toISOString().split('T')[0],
        latestArrivalTime: flight.arrivalTimes[flight.arrivalTimes.length - 1],
        latestDepartureTime: flight.departureTimes[flight.departureTimes.length - 1],
        latestArrivalDelay: formatDelay(flight.arrivalDelays[flight.arrivalDelays.length - 1] || 0),
        latestDepartureDelay: formatDelay(flight.departureDelays[flight.departureDelays.length - 1] || 0)
      };
      res.status(200).json(formattedFlight);
    } else {
      res.status(404).json({ message: 'Flight not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flight details', error });
  }
});

// Update flight details and notify users
router.post('/update', async (req, res) => {
  const { flightNumber, arrivalDate, arrivalTime, departureTime, isCancelled, destination } = req.body;
  try {
    let flight = await Flight.findOne({ flightNumber });
    if (flight) {
      flight.arrivalDate = arrivalDate;
      flight.isCancelled = isCancelled;
      flight.destination = destination;

      if (arrivalTime) {
        flight.arrivalTimes.push(arrivalTime);
        const initialArrivalTime = new Date(`1970-01-01T${flight.arrivalTimes[0]}Z`).getTime();
        const currentArrivalTime = new Date(`1970-01-01T${arrivalTime}Z`).getTime();
        const arrivalDelay = (currentArrivalTime - initialArrivalTime) / 60000;
        flight.arrivalDelays.push(arrivalDelay);
      }

      if (departureTime) {
        flight.departureTimes.push(departureTime);
        const initialDepartureTime = new Date(`1970-01-01T${flight.departureTimes[0]}Z`).getTime();
        const currentDepartureTime = new Date(`1970-01-01T${departureTime}Z`).getTime();
        const departureDelay = (currentDepartureTime - initialDepartureTime) / 60000;
        flight.departureDelays.push(departureDelay);
      }
    } else {
      flight = new Flight({
        flightNumber,
        arrivalDate,
        arrivalTimes: [arrivalTime],
        departureTimes: [departureTime],
        isCancelled,
        destination,
        arrivalDelays: [0],
        departureDelays: [0]
      });
    }
    await flight.save();

    const io = req.io;

    // Fetch users associated with this flight
    const users = await User.find({ associatedFlights: flightNumber });
    console.log(`Users found for flight ${flightNumber}: ${users.map(user => user._id)}`);
    users.forEach(async (user) => {
      // Construct notification message
      const latestArrivalTime = flight.arrivalTimes[flight.arrivalTimes.length - 1];
      const latestDepartureTime = flight.departureTimes[flight.departureTimes.length - 1];
      const notificationMessage = `The Flight ${flightNumber} scheduled for ${arrivalDate} will depart at ${latestDepartureTime} and arrive at ${latestArrivalTime} at ${destination}. Thank you and have a safe flight.`;

      // Push notification message to user notifications array
      user.notifications.push({
        message: notificationMessage,
        date: new Date()
      });
      await user.save();

      // Emit real-time update to user
      io.to(user._id.toString()).emit('flightUpdate', {
        message: notificationMessage,
        flight: flight
      });

      // Log the flight update details
      console.log(`Sent update to user ${user._id}: Flight Number ${flightNumber}, Arrival Date ${flight.arrivalDate}, Arrival Times ${flight.arrivalTimes}, Departure Times ${flight.departureTimes}, Is Cancelled ${flight.isCancelled}, Destination ${flight.destination}`);
    });

    res.status(200).json({ message: 'Flight updated successfully' });
  } catch (error) {
    console.error('Error updating flight:', error);
    res.status(500).json({ message: 'Error updating flight', error });
  }
});

module.exports = router;
