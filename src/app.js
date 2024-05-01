const express = require('express');
const mongoose = require('mongoose');
const { urlencoded, json } = require('body-parser');
const { config } = require('dotenv');
const { join } = require('path');
const urlRoutes = require('./routes/url');

// Load environment variables from .env file
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(urlencoded({ extended: true }));
app.use(json());

// Serve static files from the public directory
app.use(express.static(join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
app.use('/api', urlRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Handle 404 Not Found
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
