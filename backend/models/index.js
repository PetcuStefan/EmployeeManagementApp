// models/index.js
const sequelize = require("./sequelize");
const User = require("./users");
const Company = require("./companies");
const Department = require("./departments");

// Setup associations
User.hasMany(Company, { foreignKey: "googleId" });
Company.belongsTo(User, { foreignKey: "googleId" });

Company.hasMany(Department, { foreignKey: "company_id" });
Department.belongsTo(Company, { foreignKey: "company_id" });

// Optional connection test
sequelize.authenticate()
  .then(() => console.log("Database connection successful!"))
  .catch((err) => console.error("Unable to connect:", err));

module.exports = { sequelize, User, Company, Department };
