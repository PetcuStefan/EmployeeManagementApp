// models/index.js
const sequelize = require("./sequelize");
const User = require("./users");
const Company = require("./companies");
const Department = require("./departments");
const Employee = require("./employees");
const SalaryHistory = require("./salary_history");
const ManagerHistory = require("./manager_history");

// Setup associations
User.hasMany(Company, { foreignKey: "googleId" });
Company.belongsTo(User, { foreignKey: "googleId" });

Company.hasMany(Department, { foreignKey: "company_id" });
Department.belongsTo(Company, { foreignKey: "company_id" });

Department.hasMany(Employee, {foreignKey: "department_id"});
Employee.belongsTo(Department, {foreignKey: "department_id"});

Employee.hasMany(SalaryHistory,{foreignKey:"employee_id"});
SalaryHistory.belongsTo(Employee,{foreignKey:"employee_id"});

Employee.hasMany(ManagerHistory,{foreignKey:"employee_id"});
ManagerHistory.belongsTo(Employee,{foreignKey:"employee_id"});

// Optional connection test
sequelize.authenticate()
  .then(() => console.log("Database connection successful!"))
  .catch((err) => console.error("Unable to connect:", err));

module.exports = { sequelize,
  User,
  Company, 
  Department, 
  Employee, 
  SalaryHistory,
  ManagerHistory 
};
