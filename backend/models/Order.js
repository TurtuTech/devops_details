const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Orders = sequelize.define('orders', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },

  phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  weight: {
      type: DataTypes.DECIMAL,
      allowNull: false,
  },
  pickupAddress: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  dropAddress: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  content: {
      type: DataTypes.STRING,
  },
  deliveryInstructions: {
      type: DataTypes.TEXT,
      allowNull: true, // Optional field
  },
  receiverPhonenumber: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  receiverName: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  pickupDate: {
      type: DataTypes.DATE,
      allowNull: true, // Only for scheduled deliveries
  },
  pickupTime: {
      type: DataTypes.TIME,
      allowNull: true, // Only for scheduled deliveries
  },
  status: {
      type: DataTypes.ENUM('pending', 'active', 'picked', 'delivered'),
      defaultValue: 'pending',
  },
  createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'orders',
});

module.exports = Orders;
