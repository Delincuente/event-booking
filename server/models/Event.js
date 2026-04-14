const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  total_tickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  available_tickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Event;
