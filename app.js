const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

dotenv.config();
require("../src/db/conn");
const book = require("../src/modules/user");
const port = 3000;
app.use(express.json());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.get("/", async (req, res) => {
    res.send("hello");
});

app.post('/user', async (req, res) => {
    try {
      if (req.body.seat_number < 0 || req.body.seat_number > 6) {
        res.status(400).send('Invalid seat number');
        return;
      }
  
      const booking = await book.findOne({ seat_number: req.body.seat_number });
      if (!booking) {
        const newBooking = new book({ ...req.body, version: 0 });
        await newBooking.save();
        res.status(201).send(newBooking);
      } else {
        // Optimistic locking check
        if (booking.version === req.body.version) {
          booking.name = req.body.name;
          booking.version += 1;
          await booking.save();
          res.status(200).send(booking);
        } else {
          res.status(409).send('Conflict: Version mismatch');
        }
      }
    } catch (e) {
      res.status(400).send(e);
    }
  });
  

app.get("/user", async (req, res) => {
    try {
        const bookings = await book.find({});
        res.status(201).send(bookings);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/user/id/:id", async (req, res) => {
    try {
        const booking = await book.findById(req.query._id);
        res.send(booking);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/user/seat_number", async (req, res) => {
    try {
        const findbooking = await book.find({ seat_number: req.body.seat_number });
        res.send(findbooking);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.listen(port, () => {
    console.log("connection is live on port " + port);
});
