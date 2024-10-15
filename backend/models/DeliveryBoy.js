// models/DeliveryBoy.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DeliveryBoy = sequelize.define('DeliveryBoy', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('delivery boy'),
    defaultValue: 'delivery boy',
  },
  available: {
    type: DataTypes.ENUM('available', 'assigned'),
    defaultValue: 'available',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
}, 
{
  timestamps: false,
});

module.exports = DeliveryBoy;
