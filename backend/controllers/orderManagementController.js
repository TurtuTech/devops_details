require('dotenv').config({ path: './backend/.env' });
const Customer = require('../models/customer');
const User = require('../models/user');
const DeliveryBoy = require('../models/deliveryBoy');
const Pricing = require('../models/pricing');
const axios = require('axios');

// Fetch customer data by phone number
exports.getCustomerData = async (req, res) => {
    const { phoneNumber } = req.params;

    try {
        const customer = await Customer.findOne({
            where: { phoneNumber },
            attributes: ['phoneNumber', 'name', 'email', 'pickupAddress'],
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
};

// Fetch user data by user ID
exports.getUserData = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId, {
            attributes: ['name', 'phonenumber', 'email', 'role'],
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
};

// Fetch available drivers
exports.getAvailableDrivers = async (req, res) => {
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
};

// Fetch all pricing records
async function getPricing() {
    return await Pricing.findAll();
}

// Calculate distance fare
async function calculateDistanceFare(distance) {
    const pricing = await getPricing();
    const distancePricing = pricing.find(p => p.weight_bracket_start === 0);

    const baseFare = distancePricing.base_fare;
    const extraFarePerKm = distancePricing.extra_fare_per_km;
    const baseDistance = distancePricing.base_distance;

    let distanceFare;
    if (distance <= baseDistance) {
        distanceFare = baseFare;
    } else {
        const extraDistance = distance - baseDistance;
        const extraFare = extraDistance * extraFarePerKm;
        distanceFare = baseFare + extraFare;
    }

    return { baseFare, extraFarePerKm, distanceFare };
}

// Calculate weight fare
async function calculateWeightFare(weight) {
    const pricing = await getPricing();
    const weightPricing = pricing.find(p => weight > p.weight_bracket_start && weight <= p.weight_bracket_end);

    return weightPricing ? weightPricing.weight_fare : 0;
}

// Calculate total fare
async function calculateTotalFare(distance, weight) {
    const { baseFare, extraFarePerKm, distanceFare } = await calculateDistanceFare(distance);
    const weightFare = await calculateWeightFare(weight);
    const totalFare = Math.ceil(distanceFare + weightFare);

    return { totalFare, baseFare, extraFarePerKm };
}

// Calculate fare based on distance and weight
exports.calculateFare = async (req, res) => {
    const { distance, weight } = req.body;

    if (typeof distance !== 'number' || distance < 0) {
        return res.status(400).json({ message: 'Invalid distance provided.' });
    }

    if (typeof weight !== 'number' || weight < 0) {
        return res.status(400).json({ message: 'Invalid weight provided.' });
    }

    try {
        const { totalFare, baseFare, extraFarePerKm } = await calculateTotalFare(distance, weight);
        
        res.json({
            totalAmount: `₹${totalFare}`,
            baseFare: `₹${baseFare}`,
            extraFarePerKm: `₹${extraFarePerKm}`,
            distance,
            weight,
        });
    } catch (err) {
        console.error('Error calculating fare:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get distance matrix using Google Places API
exports.getDistanceMatrix = async (req, res) => {
    const { origins, destinations } = req.query;
    const googlePlacesKey = process.env.GOOGLE_PLACES_API_KEY;

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins,
                destinations,
                key: googlePlacesKey,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error calculating distance:', error);
        res.status(500).send('Error calculating distance');
    }
};

// Get autocomplete suggestions using Google Places API
exports.getAutocomplete = async (req, res) => {
    const { input } = req.query;
    const googlePlacesKey = process.env.GOOGLE_PLACES_API_KEY;
    const locationbias = 'rectangle:11.5833,74.0379|18.5658,78.2271';

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input,
                key: googlePlacesKey,
                locationbias,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from Google Places API:', error);
        res.status(500).json({ error: 'Error fetching data from Google Places API' });
    }
};
