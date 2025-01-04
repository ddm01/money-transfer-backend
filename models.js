 
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:./database.sqlite');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((error) => console.error('Error syncing database:', error));

module.exports = { User, sequelize };
