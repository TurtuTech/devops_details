
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
app.use(cors());

// Import route modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/User');
const dataRoutes = require('./routes/data');
const dataOrders = require('./routes/orders');
// const ProfileData = require('./routes/ProfileData');


// Middleware
app.use(bodyParser.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/orders', dataOrders);
// app.use('/api/ProfileData', ProfileData);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
