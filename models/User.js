const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  notifications: [{ message: String, date: { type: Date, default: Date.now } }],
  associatedFlights: [{ type: String }]
});

module.exports = mongoose.model('User', userSchema);
