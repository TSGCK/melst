const { DataTypes } = require('sequelize');
const sequelize = require('../auth/connection');

const ReservedSlot = sequelize.define('ReservedSlot', {
  server: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

ReservedSlot.sync();

module.exports = ReservedSlot;
