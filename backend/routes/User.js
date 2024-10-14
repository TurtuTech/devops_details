const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const User = require('../models/user');
const DeliveryBoy = require('../models/DeliveryBoy');



router.get('/customer_data/:phoneNumber', async (req, res) => {
    const { phoneNumber } = req.params;

    try {
        const customer = await Customer.findOne({
            where: { phoneNumber },
            attributes: ['phoneNumber','name', 'email', 'pickupAddress'], // Specify fields to retrieve
        });

        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        console.error('Error fetching customer data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




router.get('/testusers/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
      const user = await User.findByPk(userId, {
          attributes: ['name', 'phonenumber', 'email', 'role'], // Specify the fields you want
      });

      if (user) {
          res.json(user);
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (err) {
      console.error('Error fetching user data:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/drivers', async (req, res) => {
  try {
      const drivers = await DeliveryBoy.findAll({
          where: {
              role: 'delivery boy',
              available: 'available'
          },
      });

      if (drivers.length > 0) {
          res.json(drivers);
      } else {
          res.status(404).json({ message: 'No available drivers found' });
      }
  } catch (err) {
      console.error('Error fetching drivers:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;


