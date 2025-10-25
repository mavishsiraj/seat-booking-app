require("./db/conn");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./modules/user");
const Bus = require("./modules/bus");
const Booking = require("./modules/booking");

const app = express();

app.use(cors({
  origin: "http://localhost:9000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
})); app.use(bodyParser.json());
// ---------------- AUTH ROUTES ----------------
// ✅ FIXED REGISTRATION - Let pre-save hook handle hashing
app.post("/auth/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize inputs
    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    // Validate
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ DON'T hash here - let the pre-save hook do it
    const newUser = new User({
      name,
      email,
      password // Pass plaintext - pre-save hook will hash it
    });

    await newUser.save(); // Pre-save hook hashes password automatically

    console.log("✅ User registered successfully:", email);

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: error.message });
  }
});


// ✅ FIXED LOGIN - Use the schema method
app.post("/auth/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    console.log("🔐 Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Use the schema method instead of bcrypt.compare directly
    const isMatch = await user.comparePassword(password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Login successful");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/admin/buses", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post("/admin/buses", async (req, res) => {

  try {
    const bus = new Bus(req.body);
    const savedBus = await bus.save();
    res.status(201).json(savedBus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update bus
app.put("/admin/buses/:id", async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/admin/buses/:id", async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post("/user", async (req, res) => {
  try {
    const { seat_number, name } = req.body;
    if (!seat_number || !name) {
      return res.status(400).send("Seat number and name are required.");
    }

    const existing = await Booking.findOne({ seat_number });
    if (existing) {
      return res.status(400).send(`Seat ${seat_number} is already booked.`);
    }

    const newBooking = new Booking({ seat_number, name });
    await newBooking.save();

    res.status(201).json({ message: "Booking successful!", booking: newBooking });
  } catch (err) {
    res.status(500).send("Error booking seat: " + err.message);
  }
});



app.get("/user", async (req, res) => {
  try {
    const bookings = await Booking.find();  // Changed from User to Booking
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).send("Error fetching bookings: " + err.message);
  }
});



app.post("/bus/add", async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json({ message: "Bus added successfully!", bus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search buses (User use)
app.get("/bus/search", async (req, res) => {
  try {
    const { from, to, date } = req.query;
    console.log('Received search request:', { from, to, date });

    if (!from || !to || !date) {
      console.log('Missing required parameters');
      return res.status(400).send("from, to and date are required!");
    }

    // Convert search terms to case-insensitive and trim whitespace
    const searchFrom = from.trim();
    const searchTo = to.trim();
    console.log('Searching for buses with:', { searchFrom, searchTo, date });

    // Find all buses to check what's in the database
    const allBuses = await Bus.find({});
    console.log('All buses in database:', allBuses);

    const buses = await Bus.find({
      source: searchFrom,
      destination: searchTo,
      date: date
    });

    console.log('Search results:', buses);

    if (buses.length === 0) {
      return res.status(404).json({ message: "No buses found" });
    }

    res.json(buses);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/bus/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const auth = require("./modules/auth");

app.post("/booking", auth, async (req, res) => {
  try {
    const { busId, seats, totalAmount } = req.body;

    if (!busId || !seats || seats.length === 0) {
      return res.status(400).json({ message: "busId and seats are required!" });
    }

    // ✅ Atomic update - prevents race conditions
    const bus = await Bus.findOneAndUpdate(
      {
        _id: busId,
        seatsAvailable: { $gte: seats.length },
        bookedSeats: { $nin: seats } // Ensure none of the seats are already booked
      },
      {
        $push: { bookedSeats: { $each: seats } },
        $inc: { seatsAvailable: -seats.length }
      },
      { new: true }
    );

    if (!bus) {
      // Check if bus exists
      const busExists = await Bus.findById(busId);
      if (!busExists) {
        return res.status(404).json({ message: "Bus not found" });
      }

      // Check which seats are already booked
      const unavailableSeats = seats.filter(seat =>
        busExists.bookedSeats && busExists.bookedSeats.includes(seat)
      );

      if (unavailableSeats.length > 0) {
        return res.status(400).json({
          message: "Some seats are already booked",
          unavailableSeats
        });
      }

      return res.status(400).json({
        message: "Not enough seats available",
        availableSeats: busExists.seatsAvailable
      });
    }

    // Create booking
    const booking = new Booking({
      userId: req.user._id,
      busId,
      seats,
      totalAmount,
      bookingDate: new Date()
    });
    await booking.save();

    res.json({
      message: "Booking successful",
      bookingId: booking._id,
      bookedSeats: seats,
      totalAmount,
      user: { id: req.user._id, name: req.user.name, email: req.user.email }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
