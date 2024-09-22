// module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/.env' });
const pool = require('./../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

 
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Registration
router.post('/register', async (req, res) => {
  const { name, email, phonenumber, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, phonenumber, otp, otp_expires) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phonenumber, otp, otpExpires]
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Failed to send OTP:', error);
        return res.status(500).json({ error: 'Failed to send OTP' });
      }

      const token = jwt.sign({ id: result.insertId, email, role, phonenumber }, 'your_jwt_secret', { expiresIn: '1h' });
      res.status(201).json({ token, user: { id: result.insertId, name, email, role, phonenumber } });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'User registration failed' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (user && user.otp === otp && new Date() < new Date(user.otp_expires)) {
      // OTP is valid; clear OTP fields
      await pool.query('UPDATE users SET otp = NULL, otp_expires = NULL WHERE email = ?', [email]);

      // Move delivery boy data to delivery_boys table
      if (user.role === 'delivery boy') {
        try {
          const [result] = await pool.query(
            'INSERT INTO delivery_boys (name, email, password, phonenumber, role,created_at,user_id) VALUES (?, ?, ?, ?, ?, ?,?)',
            [user.name, user.email, user.password, user.phonenumber, user.role, new Date(), user.id]
          );


          console.log('Delivery boy data moved successfully:', result);
        } catch (insertError) {
          console.error('Error moving data to delivery_boys table:', insertError);
          return res.status(500).json({ error: 'Failed to move data to delivery_boys table' });
        }
      }

      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const adminEmail=process.env.ADMIN_USER;
  const adminPassword=process.env.ADMIN_PASS;
  try {
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ email: adminEmail, role: 'admin' }, 'turtuteam', { expiresIn: '1h' });
      return res.json({ 
        token, 
        user: { 
          id: '001', // Replace with a proper admin ID if available
          name: 'Anil chavan',
          email: adminEmail,
          role: 'admin',
          isApproved: true,
        } 
      });
    }
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
   const isApproved =user.isApproved;
   console.log(isApproved);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        phonenumber: user.phonenumber 
      }, 'turtuteam', { expiresIn: '1h' });

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          isApproved:user.isApproved,
          phonenumber: user.phonenumber 
        } 
      });
    } else {
      res.status(400).json({ error: 'Invalid credentials / wait for admin approval' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });

  }
});




module.exports = router;
