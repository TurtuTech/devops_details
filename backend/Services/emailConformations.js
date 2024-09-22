require('dotenv').config({ path: './backend/.env' });
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Ensure this is the correct app-specific password
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'turtutest6@gmail.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Email sent to ${to}`);
  } catch (error) {
    // console.error(`Error sending email to ${to}:`, error);
  }
};

module.exports = { sendEmail };
