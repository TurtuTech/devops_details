<<<<<<< HEAD
require('dotenv').config({ path: './backend/.env' });
=======
>>>>>>> 04390e0e6aae7dcbd99d99bcda050c89da95905a
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './backend/.env' }); 
const cors = require('cors');
<<<<<<< HEAD
const app = express();

app.use(bodyParser.json());
=======

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
>>>>>>> 04390e0e6aae7dcbd99d99bcda050c89da95905a

// Import route modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/User');
const dataRoutes = require('./routes/data');
const dataOrders = require('./routes/orders');
<<<<<<< HEAD
const adminRoutes = require('./routes/admin');
const sequelize = require('./config/sequelize');

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL.split(',');
=======
>>>>>>> 04390e0e6aae7dcbd99d99bcda050c89da95905a

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

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/orders', dataOrders);
<<<<<<< HEAD
app.use('/api/admin',adminRoutes);
 // Sync database models

 const start = async () => {
  try {
    // Use alter to modify the tables according to model definitions
    await sequelize.sync({ alter: true, force: false  }); 
    console.log('Database synced successfully');
    
    const PORT = process.env.PORT || 5000; // Default to 5000 if PORT not set
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

start();
=======
>>>>>>> 04390e0e6aae7dcbd99d99bcda050c89da95905a

// Error handling middleware
app.use((err, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

<<<<<<< HEAD
=======
// Start the server
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
>>>>>>> 04390e0e6aae7dcbd99d99bcda050c89da95905a
