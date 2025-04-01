const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",  // ✅ Use MySQL dialect
  dialectModule: require("mysql2"),  // ✅ Use mysql2 as the driver
  logging: false,  // ✅ Disable logging (optional)
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
