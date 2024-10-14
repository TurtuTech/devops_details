const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const AssignedOrder = sequelize.define('AssignedOrder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  driver_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  driver_phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'picked', 'delivered'),
    allowNull: false,
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
  pickupAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  dropAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  pickupDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  pickupTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  receiverPhonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiverName: {
    type: DataTypes.STRING,
    allowNull: false,
},
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deliveryInstructions: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional field
},
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'assigned_orders',  // Ensures the model matches the existing table name
});

module.exports = AssignedOrder;
