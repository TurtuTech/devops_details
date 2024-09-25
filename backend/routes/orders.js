
const express = require('express');
const router = express.Router();
const pool = require('./../config/db');
const { sendEmail } = require('./../Services/emailConformations');
const { generateOTP} =  require('./../Services/genarateOtp')

router.get('/orders', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM orders WHERE status = ?', ['pending']);
    res.json(results);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

router.get('/orders/assigned', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM orders WHERE status IN (?, ?, ?)', ['active', 'picked', 'delivered']);
    res.json(results);
  } catch (err) {
    console.error('Error fetching assigned orders:', err);
    res.status(500).json({ error: 'Error fetching assigned orders' });
  }
});

router.get('/admin/orders', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM orders WHERE status IN (?, ?)', ['active','picked']);
    res.json(results);
   
    
  } catch (err) {
    console.error('Error fetching assigned orders:', err);
    res.status(500).json({ error: 'Error fetching assigned orders' });
  }
});


router.get('/bar', async (req, res) => {
  const view = req.query.view || 'weekly';
  let query;

  if (view === 'monthly') {
    query = `
        SELECT DATE_FORMAT(createdAt, '%Y-%m') as date, COUNT(*) as count
        FROM orderManage.orders
        WHERE createdAt >= NOW() - INTERVAL 12 MONTH
        GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
        ORDER BY DATE_FORMAT(createdAt, '%Y-%m') DESC;

    `;
  } else if (view === 'yearly') {
    query = `
        SELECT YEAR(createdAt) as date, COUNT(*) as count
        FROM orderManage.orders
        WHERE createdAt >= NOW() - INTERVAL 5 YEAR
        GROUP BY YEAR(createdAt)
        ORDER BY YEAR(createdAt) DESC;

    `;
  } else {
    query = `
      SELECT DATE(createdAt) as date, COUNT(*) as count
      FROM orderManage.orders
      WHERE createdAt >= NOW() - INTERVAL 6 DAY
      GROUP BY DATE(createdAt)
      ORDER BY DATE(createdAt) DESC;

    `;
  }
  try {
    const [results] = await pool.query(query);
    res.json(results);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

router.post('/assign', async (req, res) => {
  const { orderId, driverPhoneNumber, driverName, driverEmail, userId } = req.body;

  try {
    
    const [orderResult] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const order = orderResult[0];


    const otp = generateOTP();

    await pool.query(`
      INSERT INTO assigned_orders (
        order_id, driver_id, driver_name, driver_phone_number, status, phoneNumber, name, email, pickupAddress, dropAddress, content, weight, pickupDate, pickupTime, dropTime, createdAt, receiverPhonenumber, otp
      ) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        orderId, userId, driverName, driverPhoneNumber, 'active', order.phoneNumber, order.name, order.email, order.pickupAddress, order.dropAddress, order.content, order.weight, order.pickupDate, order.pickupTime, order.dropTime, order.createdAt, order.receiverPhonenumber, otp
      ]
    );


    await pool.query('UPDATE orders SET status = ?, assignedDriver = ? WHERE id = ?', ['active', driverName, orderId]);

    await pool.query('UPDATE delivery_boys SET available = ? WHERE phonenumber = ?', ['assigned', driverPhoneNumber]);

    const customerMessage = `
      Dear ${order.name},

      Your order with ID ${orderId} has been assigned to a driver. The driver details are as follows:
      Name: ${driverName}
      Phone Number: ${driverPhoneNumber}

      Thank you for choosing Turtu.
  
      Best regards,
      The Turtu Team
        `;
    await sendEmail(order.email, 'Your Order Has Been Assigned', customerMessage);


    const driverMessage = `
      Dear ${driverName},
      You have been assigned a new order with ID ${orderId}. The order details are as follows:
      Pickup Address: ${order.pickupAddress}
      Drop Address: ${order.dropAddress}
      Content: ${order.content}
      Weight: ${order.weight}
      Pickup Date: ${order.pickupDate}
      Pickup Time: ${order.pickupTime}

      Please contact the customer if necessary.

      Best regards,
      The Turtu Team
    `;
    await sendEmail(driverEmail, 'New Order Assigned to you', driverMessage);

    res.json({ message: 'Driver assigned successfully and emails sent!' });
  } catch (err) {
    console.error('Error assigning driver:', err);
    res.status(500).json({ error: 'Error assigning driver' });
  }
});

router.get('/assigned-orders/:driver_id', async (req, res) => {
  const { driver_id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM assigned_orders WHERE driver_id = ?',
      [driver_id]
    );

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No assigned orders found for this driver' });
    }
  } catch (error) {
    console.error('Error retrieving assigned orders:', error);
    res.status(500).json({ error: 'Failed to retrieve assigned orders' });
  }
});



router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId);
  
  try {
    const [results] = await pool.query('SELECT * FROM assigned_orders WHERE order_id = ?', [orderId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching assigned orders:', error);
    res.status(500).json({ message: 'Error fetching assigned orders' });
  }
});



router.put('/update-status', async (req, res) => {
  const { orderId, status, driverUserId } = req.body;

  if (!orderId || !status || !driverUserId) {
    return res.status(400).json({ message: 'Order ID, status, and driver user ID are required' });
  }

  if (!['active', 'picked', 'delivered'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {

    const [currentStatusResult] = await pool.query('SELECT email, status, name FROM orders WHERE id = ?', [orderId]);
    const [otpResult] = await pool.query('SELECT otp FROM assigned_orders WHERE order_id = ?', [orderId]);
    const currentStatus = currentStatusResult[0]?.status;
    const customerEmail = currentStatusResult[0]?.email;
    const customerName = currentStatusResult[0]?.name;
    const deliveryOtp = otpResult[0]?.otp;

    if (!currentStatus || !customerEmail) {
      return res.status(404).json({ message: 'Order or customer details not found' });
    }

  
    if (currentStatus === 'delivered') {
      return res.status(400).json({ message: 'Order is already delivered' });
    }

    if (currentStatus === 'picked' && status === 'active') {
      return res.status(400).json({ message: 'Cannot revert to active from picked' });
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    await pool.query('UPDATE assigned_orders SET status = ? WHERE order_id = ?', [status, orderId]);

    if (status === 'delivered') {
      const [idResult] = await pool.query('SELECT id FROM delivery_boys WHERE user_id = ?', [driverUserId]);
      const driverId = idResult[0]?.id;

      const customerDeliveredMessage = `
      Dear ${customerName},
    
      We are delighted to inform you that your order (ID: ${orderId}) has been successfully delivered.
    
      Thank you for choosing Turtu! We hope you enjoy your purchase.
    
      Best regards,
      The Turtu Team
    `;
    
    await sendEmail(customerEmail, 'Order Successfully Delivered', customerDeliveredMessage);



      if (driverId) {
        await pool.query('UPDATE delivery_boys SET available = ? WHERE id = ?', ['available', driverId]);
      } else {
        console.error('Driver not found');
      }
    }


    if (status === 'picked') {
      const customerOtpMessage = `
        Dear ${customerName},

        Your order with ID ${orderId} has been picked up and is on its way.

        Please provide the following OTP to the delivery driver upon arrival:
        This OTP is crucial to ensure the security and proper handling of your order.

        OTP: ${deliveryOtp}

        Thank you for choosing Turtu.

        Best regards,
        The Turtu Team
      `;

      await sendEmail(customerEmail, 'Your Delivery OTP', customerOtpMessage);
    }

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Error updating order status' });
  }
});



router.post('/verify-delivery-otp', async (req, res) => {
  const { orderId, providedOtp } = req.body;

  if (!orderId || !providedOtp) {
    return res.status(400).json({ message: 'Order ID and OTP are required' });
  }

  try {

    const [otpResult] = await pool.query('SELECT otp FROM assigned_orders WHERE order_id = ?', [orderId]);
    const storedOtp = otpResult[0]?.otp;

    if (storedOtp === providedOtp) {
      res.status(200).json({ message: 'OTP verified successfully', valid: true });
    } else {
      res.status(400).json({ message: 'Invalid OTP', valid: false });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});


module.exports = router;
