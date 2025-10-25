const mongoose = require("mongoose");

// Use environment variable for MongoDB URI, fallback to localhost for development
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bus-booking";

console.log("🔗 Connecting to:", MONGODB_URI); // Debug log

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

module.exports = mongoose.connection;
