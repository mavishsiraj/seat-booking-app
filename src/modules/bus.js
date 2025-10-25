const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
  },
  busType: {
    type: String,
    required: true,
  },
  bookedSeats: {
    type: [String],
    default: [],
  },
});

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
