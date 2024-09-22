const express = require('express');
const router = express.Router();
const pool = require('./../config/db');



router.get('/customer_data/:phoneNumber', async (req, res) => {
    const { phoneNumber } = req.params;
    const query = 'SELECT name, email, pickupAddress ,phoneNumber FROM customer_data WHERE phoneNumber = ?';
  
    try {
      const [results] = await pool.query(query, [phoneNumber]);
  
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



  router.get('/testusers/:userId', async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const query = 'SELECT name, phonenumber, email, role FROM users WHERE id = ?';
  
    try {
      const [results] = await pool.query(query, [userId]); // Use async/await for querying
  
      if (results.length > 0) {
        res.json(results[0]); // Send the first result as JSON response
      } else {
        res.status(404).json({ message: 'User not found' }); // User not found
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error' }); // Handle server errors
    }
  });


router.get('/drivers', async (req, res) => {
    const query = `
      SELECT *FROM delivery_boys 
      WHERE role = "delivery boy" AND available = "available"
    `;
  
    try {
      const [results] = await pool.query(query);
  
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ message: 'No available drivers found' });
      }

      
    } catch (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
module.exports = router;
