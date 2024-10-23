require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());

// Import route modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const dataRoutes = require('./routes/data');
const dataOrders = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const sequelize = require('./config/sequelize');

// CORS configuration
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

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/orders', dataOrders);
app.use('/api/admin',adminRoutes);
 // Sync database models

 const start = async () => {
  try {
    // Use alter to modify the tables according to model definitions
    await sequelize.sync({ alter: false, force: false  }); 
    console.log('Database synced successfully');
    
    const PORT = process.env.PORT ; // Default to 5000 if PORT not set
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

start();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

