// models/Contact.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures email is unique
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  queries: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, 
{
  tableName: 'Contact', // Specify the table name in the database
  timestamps: false, // Disable automatic timestamps
});

// Export the Contact model
module.exports = Contact;