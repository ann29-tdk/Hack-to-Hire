const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const flightRoutes = require('./routes/flight');
const helmet = require('helmet');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Ensure this matches the domain of your front-end application
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(cors());
app.use(helmet());

// Parse JSON payloads
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'build')));

// Routes
app.use('/auth', authRoutes);
app.use('/flight', (req, res, next) => {
  req.io = io;
  next();
}, flightRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://annie29:anurag@cluster0.oo3kmna.mongodb.net/flight', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Handle connections for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('join', (userId) => {
    if (userId) {
      socket.userId = userId;
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    } else {
      console.log('User ID not provided');
    }
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});


