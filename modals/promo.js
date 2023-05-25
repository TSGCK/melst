const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './databases/promos.sqlite',
});


const Promo = sequelize.define('Promo', {
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Ensure the table is created
Promo.sync();

module.exports = {
  Promo,
  sequelize,
};
