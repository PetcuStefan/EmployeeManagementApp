const { DataTypes } = require("sequelize");
const sequelize = require("./index"); // Import Sequelize database connection

const User = sequelize.define("User", {  // Table name: "users"
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,  // Email should be a STRING, not INTEGER
    allowNull: false,
    unique: true,  // Ensure emails are unique
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "users",  // Explicitly define table name in DB
  timestamps: true,  // Adds `createdAt` and `updatedAt` fields
});

module.exports = User;