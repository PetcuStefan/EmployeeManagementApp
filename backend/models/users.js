const { DataTypes } = require("sequelize");
const sequelize = require("./index"); // Import Sequelize database connection

const User = sequelize.define("User", {  // Table name: "users"
  email: {
    type: DataTypes.STRING,  // Email should be a STRING, not INTEGER
    allowNull: false,
    unique: true,  // Ensure emails are unique
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    field: "googleId",
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "displayName",
  },
}, {
  tableName: "users",  // Explicitly define table name in DB
  timestamps: true,  // Adds `createdAt` and `updatedAt` fields
  primaryKey: 'googleId'
});

module.exports = User;