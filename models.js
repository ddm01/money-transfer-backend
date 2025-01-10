const { Sequelize, DataTypes } = require('sequelize');

// Database Setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

// User Model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 10],
      isNumeric: true,
    },
  },
  nic: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [12, 12],
      isNumeric: true,
    },
  },
  paymentAccount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { sequelize, User };
