const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register endpoint
router.post('/register', async (req, res) => {
  const { name, phoneNumber, password } = req.body;
  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      name,
      phoneNumber,
      password: hashedPassword,
      isAdmin: false,
      associatedFlights: []
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        flightNumber: user.flightNumber,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(400).json({ message: 'Invalid phone number or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Fetch user data by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});

// Update user's flight number association
router.put('/user/:id/flight', async (req, res) => {
  try {
    const { flightNumber } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.associatedFlights.includes(flightNumber)) {
      user.associatedFlights.push(flightNumber);
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating flight number', error });
  }
});

// Delete a notification
router.delete('/user/:id/notifications/:index', async (req, res) => {
  try {
    const { id, index } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const flightNumber = user.notifications[index].flightNumber; // Assuming notifications have flightNumber field
    user.notifications.splice(index, 1);

    // Check if user has any other notifications for the same flight
    const hasOtherNotifications = user.notifications.some(notification => notification.flightNumber === flightNumber);

    if (!hasOtherNotifications) {
      // Remove flight association if no other notifications for the same flight exist
      user.flightNumber = null;
    }

    await user.save();
    res.status(200).json({ message: 'Notification and flight association deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification and flight association', error });
  }
});

module.exports = router;
