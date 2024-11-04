// require('dotenv').config({ path: './backend/.env' });
// const nodemailer = require('nodemailer');

// // Create a transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Ensure this is the correct app-specific password
//   },
// });

// const sendEmail = async (to, subject, header = "Turtu Notification", content = "Thank you for being a part of Turtu!", footerText = "Thank you for choosing Turtu!") => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER, // Ensure the 'from' email address is correct
//     to,
//     subject,
//     html: generateEmailTemplate(header, content, footerText),
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Email sent to ${to}`);
//   } catch (error) {
//     console.error(`Error sending email to ${to}:`, error);
//   }
// };

// const generateEmailTemplate = (header = "Turtu Notification", content = "Thank you for being a part of Turtu!", footerText = "Thank you for choosing Turtu!") => {
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>${header}</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 margin: 0;
//                 padding: 0;
//                 background-color: #f4f4f4;
//                 color: #333;
//             }
//             .container {
//                 width: 90%;
//                 max-width: 600px;
//                 margin: 20px auto;
//                 background-color: #fff;
//                 border-radius: 12px;
//                 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//                 overflow: hidden;
//                 border: 1px solid #e0e0e0;
//             }
//             .header {
//                 background-color: #007BFF;
//                 color: #ffffff;
//                 padding: 20px;
//                 text-align: center;
//                 font-size: 26px;
//                 font-weight: bold;
//             }
//             .content {
//                 padding: 25px;
//                 font-size: 16px;
//                 line-height: 1.6;
//                 color: #333;
//             }
//             .footer {
//                 text-align: center;
//                 padding: 15px;
//                 background-color: #f9f9f9;
//                 color: #555;
//                 font-size: 12px;
//                 border-top: 1px solid #e0e0e0;
//             }
//             .footer a {
//                 color: #007BFF;
//                 text-decoration: none;
//             }
//             .footer a:hover {
//                 text-decoration: underline;
//             }
//             /* Responsive styles */
//             @media (max-width: 600px) {
//                 .header {
//                     font-size: 20px;
//                     padding: 15px;
//                 }
//                 .content {
//                     padding: 20px;
//                     font-size: 14px;
//                 }
//                 .footer {
//                     font-size: 11px;
//                 }
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <div class="header">
//                 ${header}
//             </div>
//             <div class="content">
//                 ${content}
//             </div>
//         </div>
//         <div class="footer">
//             <p>${footerText}</p>
//             <p>&copy; 2024 Turtu. All Rights Reserved.</p>
//             <p><a href="https://www.turtu.com">Visit our website</a></p>
//         </div>
//     </body>
//     </html>`;
// };

// module.exports = { sendEmail, generateEmailTemplate };

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
    from: 'process.env.EMAIL_USER',
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
