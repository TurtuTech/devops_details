const express = require('express');
const router = express.Router();
const Order = require('./../models/Order');
const Customer = require('./../models/Customer');


// Route to submit customer data and order
// router.post('/submit', async (req, res) => {
//     const {
//         phoneNumber,
//         name,
//         email,
//         pickupAddress,
//         dropAddress,
//         content,
//         weight,
//         pickupDate,
//         pickupTime,
//         dropTime, // Ensure this is a valid time string
//         receiverPhonenumber
//     } = req.body;

//     try {
//         // Validate and format dropTime
//         let formattedDropTime;
//         // Check the dropTime value
//         if (dropTime === '30min') {
//             formattedDropTime = 30 ; // Store as "30 min"
//         } else if (dropTime === '60min') {
//             formattedDropTime = 60; // Store as "1 hour"
//         } else {
//             formattedDropTime = dropTime; // Fallback to the original value if not matched
//         }

//          // Check if the customer already exists
//          let customer = await Customer.findOne({ where: { email } });

//          // If customer does not exist, create a new one
//          if (!customer) {
//         // Assuming you have Customer and Order models
//        customer = await Customer.create({
//             phoneNumber,
//             name,
//             email,
//             pickupAddress,
//             dropAddress,
//             content,
//             weight,
//             pickupDate,
//             pickupTime,
//             dropTime: formattedDropTime, // Use the formatted drop time
//             receiverPhonenumber
//         });
//     }
//         await Order.create({
//             phoneNumber,
//             name,
//             email,
//             pickupAddress,
//             dropAddress,
//             content,
//             weight,
//             pickupDate,
//             pickupTime,
//             dropTime: formattedDropTime, // Use the formatted drop time
//             receiverPhonenumber,
//             status: 'pending' // Set status to pending
//         });

//         res.status(200).send('Data inserted successfully into both tables');
//     } catch (err) {
//         console.error('Error inserting data into both tables:', err);
//         res.status(500).send('Error inserting data');
//     }
// });

router.post('/submit', async (req, res) => {
    const {
        serviceType, // "Delivery Now" or "Schedule for Later"
        name,
        phoneNumber,
        email,
        weight,
        pickupAddress,
        dropAddress,
        content,
        deliveryInstructions, // optional
        receiverPhonenumber,
        receiverName,
        pickupDate, // only for 'Schedule for Later'
        pickupTime  // only for 'Schedule for Later'
    } = req.body;

    try {
        // Check if the customer already exists by email or phone number
        let customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            customer = await Customer.create({
                name,
                phoneNumber,
                email,
                pickupAddress, // Assuming this is customer-specific
                dropAddress,   // Assuming this is customer-specific
                receiverPhonenumber, // Assuming this is customer-specific
                receiverName,
                content,
                weight,
            });
        }

        // Handle immediate delivery (Delivery Now)
        if (serviceType === "Delivery Now") {
            // Proceed without scheduling fields
            await Order.create({
                phoneNumber,
                name,
                email,
                weight,
                pickupAddress,
                dropAddress,
                content,
                deliveryInstructions,
                receiverPhonenumber,
                receiverName,
                status: 'pending', // Default status
            });
            res.status(200).send('Immediate delivery order created successfully');
        }
        // Handle scheduled delivery (Schedule for Later)
        else if (serviceType === "Schedule for Later") {
            // Validate required fields for scheduled delivery
            if (!pickupDate || !pickupTime) {
                return res.status(400).send('Pickup date and time are required for scheduled deliveries');
            }

            // Proceed with scheduling fields
            await Order.create({
                customerId: customer.id,  // Associate customer with order
                phoneNumber,
                name,
                email,
                weight,
                pickupAddress,
                dropAddress,
                content,
                deliveryInstructions,
                receiverPhonenumber,
                receiverName,
                pickupDate,  // Schedule pickup date
                pickupTime,  // Schedule pickup time
                status: 'pending', // Default status
            });
            res.status(200).send('Scheduled delivery order created successfully');
        } else {
            res.status(400).send('Invalid service type');
        }
    } catch (err) {
        console.error('Error processing order:', err);
        res.status(500).send('Error creating the order');
    }
});


router.post('usersubmit', async (req, res) => {
    const {
        serviceType, // "Delivery Now" or "Schedule for Later"
        name,
        phoneNumber,
        email,
        weight,
        pickupAddress,
        dropAddress,
        content,
        deliveryInstructions, // optional
        receiverPhonenumber,
        receiverName,
        pickupDate, // only for 'Schedule for Later'
        pickupTime  // only for 'Schedule for Later'
    } = req.body;

    try {
        // Check if the customer already exists by email or phone number
        let customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            customer = await Customer.create({
                name,
                phoneNumber,
                email,
                pickupAddress, // Assuming this is customer-specific
                dropAddress,   // Assuming this is customer-specific
                receiverPhonenumber, // Assuming this is customer-specific
                receiverName,
                content,
                weight,
            });
        }

        // Handle immediate delivery (Delivery Now)
        if (serviceType === "Delivery Now") {
            // Proceed without scheduling fields
            await Order.create({
                phoneNumber,
                name,
                email,
                weight,
                pickupAddress,
                dropAddress,
                content,
                deliveryInstructions,
                receiverPhonenumber,
                receiverName,
                status: 'pending', // Default status
            });
            res.status(200).send('Immediate delivery order created successfully');
        }
        // Handle scheduled delivery (Schedule for Later)
        else if (serviceType === "Schedule for Later") {
            // Validate required fields for scheduled delivery
            if (!pickupDate || !pickupTime) {
                return res.status(400).send('Pickup date and time are required for scheduled deliveries');
            }

            // Proceed with scheduling fields
            await Order.create({
                customerId: customer.id,  // Associate customer with order
                phoneNumber,
                name,
                email,
                weight,
                pickupAddress,
                dropAddress,
                content,
                deliveryInstructions,
                receiverPhonenumber,
                receiverName,
                pickupDate,  // Schedule pickup date
                pickupTime,  // Schedule pickup time
                status: 'pending', // Default status
            });
            res.status(200).send('Scheduled delivery order created successfully');
        } else {
            res.status(400).send('Invalid service type');
        }
    } catch (err) {
        console.error('Error processing order:', err);
        res.status(500).send('Error creating the order');
    }
});


// Route to get all customer data
router.get('/userData', async (req, res) => {
  try {
      const users = await Customer.findAll(); // Assuming you have a Customer model
      res.json(users);
  } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Error fetching data' });
  }
});

module.exports = router;