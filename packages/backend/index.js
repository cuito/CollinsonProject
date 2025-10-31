require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000; // Use port from .env or default to 4000

// Middleware
app.use(cors()); // Enable CORS for all routes - important for frontend communication
app.use(express.json()); // Enable JSON body parsing

// Simple "Hello World" endpoint
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the Backend!' });
});

// Basic error handling (optional but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend service running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  GET /hello`);
});