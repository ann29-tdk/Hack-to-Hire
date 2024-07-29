const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightSchema = new Schema({
  flightNumber: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  arrivalTimes: [String],
  departureTimes: [String],
  isCancelled: { type: Boolean, default: false },
  destination: { type: String, required: true },
  arrivalDelays: [Number],
  departureDelays: [Number]
});

module.exports = mongoose.model('Flight', flightSchema);
