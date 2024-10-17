const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: { // Changed from user_id to userId
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  isBlacklisted: { // Change made here
    type: DataTypes.BOOLEAN, // Use DataTypes instead of Sequelize
    defaultValue: false,
    allowNull: false, // Set the default to not blacklisted
  },
}, 
{
  timestamps: false,
});

module.exports = Token;
