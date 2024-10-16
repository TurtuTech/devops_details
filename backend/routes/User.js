const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const User = require('../models/user');
const DeliveryBoy = require('../models/deliveryBoy');
const Pricing = require('../models/pricing');

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

// Function to fetch pricing from the database
async function getPricing() {
    return await Pricing.findAll(); // Fetch all pricing records
}

// Function to calculate distance fare
async function calculateDistanceFare(distance) {
    const pricing = await getPricing();
    const distancePricing = pricing.find(p => p.weight_bracket_start === 0); // Get distance pricing

    const baseFare = distancePricing.base_fare; // ₹50 for up to 3 km
    const extraFarePerKm = distancePricing.extra_fare_per_km; // ₹12 for each km after 3 km
    const baseDistance = distancePricing.base_distance; // base distance in km

    if (distance <= baseDistance) {
        return baseFare; // For distance <= 3 km, charge the base fare
    } else {
        const extraDistance = distance - baseDistance;
        const extraFare = extraDistance * extraFarePerKm;
        return baseFare + extraFare; // Total fare = base fare + extra fare
    }
}

// Function to calculate weight fare
async function calculateWeightFare(weight) {
    const pricing = await getPricing();
    const weightPricing = pricing.find(p => weight > p.weight_bracket_start && weight <= p.weight_bracket_end);

    return weightPricing ? weightPricing.weight_fare : 0; // Return the fare for the respective weight bracket
}

// Function to calculate total fare
async function calculateTotalFare(distance, weight) {
    const distanceFare = await calculateDistanceFare(distance);
    const weightFare = await calculateWeightFare(weight);
    const totalFare = distanceFare + weightFare;

    return Math.ceil(totalFare);
}

router.post('/calculate_fare', async (req, res) => {
    const { distance, weight } = req.body;

    // Validate inputs
    if (typeof distance !== 'number' || distance < 0) {
        return res.status(400).json({ message: 'Invalid distance provided.' });
    }

    if (typeof weight !== 'number' || weight < 0) {
        return res.status(400).json({ message: 'Invalid weight provided.' });
    }

    try {
        const totalAmount = await calculateTotalFare(distance, weight);
        res.json({ totalAmount: `₹${totalAmount}` });
    } catch (err) {
        console.error('Error calculating fare:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;

