<<<<<<< HEAD
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
=======
const mongoose = require('mongoose');

// MongoDB connection URL
const mongoURI = "mongodb://localhost:27017/seat";

// Connection options
//const options = {
	//useNewUrlParser: true,
	//useUnifiedTopology: true,
//};

// Establish the connection
mongoose.connect(mongoURI)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error.message);

		// Handle specific error conditions
		if (error.name === 'MongoNetworkError') {
			console.error('Network error occurred. Check your MongoDB server.');
		} else if (error.name === 'MongooseServerSelectionError') {
			console.error('Server selection error. Ensure'
				+ ' MongoDB is running and accessible.');
		} else {
			// Handle other types of errors
			console.error('An unexpected error occurred:', error);
		}
	});

// Handling connection events
const db = mongoose.connection;

db.on('error', (error) => {
	console.error('MongoDB connection error:', error);
});

db.once('open', () => {
	console.log('Connected to MongoDB');
});

db.on('disconnected', () => {
	console.log('Disconnected from MongoDB');
});

// Gracefully close the connection when the application exits
process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.log('Mongoose connection is disconnected'
		+ ' due to application termination');
		process.exit(0);
	});
});
>>>>>>> 946f0036a4f09f279ede8bb6faa27cbda6336eee
