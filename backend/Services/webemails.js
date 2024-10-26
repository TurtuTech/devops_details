const nodemailer = require('nodemailer');
require('dotenv').config({ path: './backend/.env' });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send OTP Email
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send OTP to ${email}: ${error.message}`);
        throw new Error('Failed to send OTP email. Please try again later.');
    }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (email, resetLink) => {
    const mailOptions = { 
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: ${resetLink}`,
        html: `<p>Click the following link to reset your password:</p> 
               <a href="${resetLink}">Reset Password</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

// Send Career Application Email
const sendCareerEmail = async (recipientEmail, username, profile, resumeFilename, resumeData) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Career Application Submitted',
        text: `Dear ${username},\n\nYour application for ${profile} has been submitted successfully.\n\nResume Filename: ${resumeFilename}`,
        attachments: [
            {
                filename: resumeFilename,
                content: resumeData,
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Career application email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`Failed to send career application email to ${recipientEmail}: ${error.message}`);
        throw new Error('Failed to send career application email. Please try again later.');
    }
};

// Send Contact Query Email
const sendQueryContactEmail = async (recipientEmail, username, queries) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Contact Query Received',
        text: `Dear ${username},\n\nThank you for your query. We will get back to you shortly.\n\nYour Query: ${queries}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Contact query email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`Failed to send contact query email to ${recipientEmail}: ${error.message}`);
        throw new Error('Failed to send contact query email. Please try again later.');
    }
};

module.exports = { 
    sendOtpEmail,
    sendPasswordResetEmail,
    sendCareerEmail,
    sendQueryContactEmail 
};
