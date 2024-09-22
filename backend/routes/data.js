const express = require('express');
const router = express.Router();
const pool = require('./../config/db');
const { sendEmail } = require('./../Services/emailConformations');

router.post('/submit', async (req, res) => {
    const {
      phoneNumber,
      name,
      email,
      pickupAddress,
      dropAddress,
      content,
      weight,
      pickupDate,
      pickupTime,
      dropTime,
      receiverPhonenumber
    } = req.body;
  
    const customerQuery = 'INSERT INTO customer_data (phoneNumber, name, email, pickupAddress, dropAddress, content, weight, pickupDate, pickupTime, dropTime,receiverPhonenumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
    const orderQuery = 'INSERT INTO orders (phoneNumber, name, email, pickupAddress, dropAddress, content, weight, pickupDate, pickupTime, dropTime, receiverPhonenumber,status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
  
  
    const values = [phoneNumber, name, email, pickupAddress, dropAddress, content, weight, pickupDate, pickupTime, dropTime,receiverPhonenumber];
    const orderValues = [...values, 'pending']; // Add 'pending' status to the values for the orders table
  
    const connection = await pool.getConnection(); // Get a connection from the pool
  
    try {
      await connection.beginTransaction(); // Start transaction
  
      // Insert into customer_data
      await connection.query(customerQuery, values);
  
      // Insert into orders
      await connection.query(orderQuery, orderValues);
  
      await connection.commit(); // Commit transaction
      res.status(200).send('Data inserted successfully into both tables');
    } catch (err) {
      await connection.rollback(); // Rollback transaction on error
      console.error('Error inserting data into both tables:', err);
      res.status(500).send('Error inserting data');
    } finally {
      connection.release(); // Release connection back to the pool
    }
  });

router.get('/userData', async (req, res) => {
    try {
      const [results] = await pool.query('SELECT * FROM customer_data'); // replace with your actual table name
      res.json(results);
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Error fetching data' });
    }
  });

  router.get('/nonapproval', async (req, res) => {
    try {
      const [results] = await pool.query('SELECT * FROM users WHERE isApproved = 0 '); // replace with your actual table name
      res.json(results); 
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Error fetching data' });
    }
  });

  // Update isApproved to 1
router.post('/accept/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE users SET isApproved = 1 WHERE id = ?', [id]);
    res.status(200).json({ message: 'Request accepted' });
    const [userDetails]= await pool.query('SELECT email, name from users where id = ?',[id]);
    const userEmail = userDetails[0]?.email;
    const userName = userDetails[0]?.name;

    const ApprovedMessage = `
    Dear ${userName},
  
    We’re excited to let you know that your account has been approved by our admin! You can now Login to your Account.
  
    Welcome to the Turtu family!
  
    Best regards,
    The Turtu Team
  `;
  
  await sendEmail(userEmail, 'Your Account Has Been Approved', ApprovedMessage);

  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).json({ error: 'Error updating request' });
  }
});

// Delete request
router.delete('/reject/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'Request rejected' });

    const [userDetails]= await pool.query('SELECT email, name from users where id = ?',[id]);
    const userEmail = userDetails[0]?.email;
    const userName = userDetails[0]?.name;

    const RejectMessage = `
    Dear ${userName},
  
    We regret to inform you that your account application has not been approved at this time. We appreciate your interest in joining Turtu and encourage you to reapply in the future.
  
    If you have any questions or need further assistance, please feel free to reach out.
  
    Thank you for your understanding.
  
    Best regards,
    The Turtu Team
  `;
  
  await sendEmail(userEmail, 'Your Account Application Status', RejectMessage);

  } catch (err) {
    console.error('Error deleting request:', err);
    res.status(500).json({ error: 'Error deleting request' });
  }
});



module.exports = router;
