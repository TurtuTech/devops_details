const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/.env' });
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('./../models/user');
const DeliveryBoy = require('./../models/DeliveryBoy');
const sequelize = require('sequelize');

<<<<<<< HEAD
// Set up nodemailer transporter
=======
>>>>>>> 04390e0e6aae7dcbd99d99bcda050c89da95905a
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Registration route
router.post('/register', async (req, res) => {
  const { name, email, phonenumber, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    // Use the User model to create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phonenumber,
      otp,
      otpExpires,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Failed to send OTP:', error);
        return res.status(500).json({ error: 'Failed to send OTP' });
      }

      const token = jwt.sign({ id: newUser.id, email, role, phonenumber }, 'your_jwt_secret', { expiresIn: '1h' });
      res.status(201).json({ token, user: { id: newUser.id, name, email, role, phonenumber } });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'User registration failed' });
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });

    if (user && user.otp === otp && new Date() < new Date(user.otpExpires)) {
      // OTP is valid; clear OTP fields
      await user.update({ otp: null, otpExpires: null, isVerified: true });

      if (user.role === 'delivery boy') {
        try {
          await DeliveryBoy.create({
            name: user.name,
            email: user.email,
            password: user.password,
            phonenumber: user.phonenumber,
            role: user.role,
            created_at: new Date(),
            user_id: user.id,
          });
          console.log('Delivery boy data moved successfully');
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

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASS;

  try {
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ email: adminEmail, role: 'admin' }, 'turtuteam', { expiresIn: '1h' });
      return res.json({
        token,
        user: {
          id: '001',
          name: 'Anil Chavan',
          email: adminEmail,
          role: 'admin',
          isApproved: true,
        }
      });
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role,
          phonenumber: user.phonenumber
        }, 'turtuteam', { expiresIn: '1h' });

        return res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            phonenumber: user.phonenumber
          }
        });
      }
    }

    res.status(400).json({ error: 'Invalid credentials / wait for admin approval' });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Function to check for unverified users and delete them if OTP expired 2 minutes ago
let isRunning = false;

const deleteUnverifiedUsers = async () => {
  if (isRunning) return; // Skip if already running
  isRunning = true;

  const now = new Date();
  try {
    const usersToDelete = await User.findAll({
      where: {
        isVerified: false,
        createdAt: {
          [sequelize.Op.lt]: new Date(now - 3 * 60 * 1000),
        }
      },
      limit: 100 // Adjust the limit as needed
    });

    await Promise.all(usersToDelete.map(user => user.destroy()));

    if (usersToDelete.length > 0) {
      console.log('Deleted unverified users:', usersToDelete.length);
    }
  } catch (error) {
    console.error('Error deleting unverified users:', error);
  } finally {
    isRunning = false; // Reset running state
  }
};

// Schedule the cleanup task to run every 5 minutes
setInterval(deleteUnverifiedUsers, 3 * 60 * 1000);

 module.exports = router;
 