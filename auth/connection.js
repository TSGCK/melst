const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'reserve.sqlite', 
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQLite database');
  } catch (error) {
    console.error('Error connecting to SQLite database:', error);
  }
})();

module.exports = sequelize;
