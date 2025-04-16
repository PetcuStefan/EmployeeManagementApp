const { DataTypes } = require("sequelize");
const sequelize = require("./index"); // Import Sequelize database connection

const Company = sequelize.define("Company", {
  company_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "companies",  // Explicitly define table name in DB
  timestamps: true,  // Adds `createdAt` and `updatedAt` fields
});

module.exports = Company;