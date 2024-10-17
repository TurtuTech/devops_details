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
router.get('/drivers',  async (req, res) => {
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
async function getPricing() {
    return await Pricing.findAll(); // Fetch all pricing records
}

// Function to calculate distance fare
async function calculateDistanceFare(distance) {
    const pricing = await getPricing();
    const distancePricing = pricing.find(p => p.weight_bracket_start === 0); // Get distance pricing

    const baseFare = distancePricing.base_fare; // Base fare for up to base distance (3 km)
    const extraFarePerKm = distancePricing.extra_fare_per_km; // Extra fare for each km after base distance
    const baseDistance = distancePricing.base_distance; // Base distance (3 km)

    let distanceFare;
    if (distance <= baseDistance) {
        distanceFare = baseFare; // For distance <= base distance, charge the base fare
    } else {
        const extraDistance = distance - baseDistance;
        const extraFare = extraDistance * extraFarePerKm;
        distanceFare = baseFare + extraFare; // Total fare = base fare + extra fare
    }

    // Return an object with all the relevant data
    return { baseFare, extraFarePerKm, distanceFare };
}

// Function to calculate weight fare
async function calculateWeightFare(weight) {
    const pricing = await getPricing();
    const weightPricing = pricing.find(p => weight > p.weight_bracket_start && weight <= p.weight_bracket_end);

    return weightPricing ? weightPricing.weight_fare : 0; // Return the fare for the respective weight bracket
}

// Function to calculate total fare
async function calculateTotalFare(distance, weight) {
    const { baseFare, extraFarePerKm, distanceFare } = await calculateDistanceFare(distance);
    const weightFare = await calculateWeightFare(weight);
    const totalFare = Math.ceil(distanceFare + weightFare); // Round up to nearest whole number

    // Return the total fare along with the baseFare and extraFarePerKm
    return { totalFare, baseFare, extraFarePerKm };
}

// Route to calculate fare
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
        // Get total fare, base fare, and extra fare per km
        const { totalFare, baseFare, extraFarePerKm } = await calculateTotalFare(distance, weight);
        
        // Return the response with all required information
        res.json({ 
            totalAmount: `₹${totalFare}`, 
            baseFare: `${baseFare}`, 
            extraFarePerKm: `₹${extraFarePerKm}`,
            distance:`${distance}`,
            weight:`${weight}`
        });
    } catch (err) {
        console.error('Error calculating fare:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
