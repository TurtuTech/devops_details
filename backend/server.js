const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config({ path: './backend/.env' }); 
const cors = require('cors');

// CORS options to allow specific IPs from the .env file
const allowedOrigins = process.env.CLIENT_URL.split(',');

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // For legacy browsers
};

// Apply CORS middleware with specific options
app.use(cors(corsOptions));

// Import route modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/User');
const dataRoutes = require('./routes/data');
const dataOrders = require('./routes/orders');

// Middleware
app.use(bodyParser.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/orders', dataOrders);

// Error handling middleware
app.use((err, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
