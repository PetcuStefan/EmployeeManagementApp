const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize"); // Import Sequelize database connection

class User extends Model {}

User.init(
  {
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
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "photo",
    },
  },
  {
    sequelize,
    modelName:"User",
    tableName: "users",  // Explicitly define table name in DB
    timestamps: true,  // Adds `createdAt` and `updatedAt` fields
  }
);

module.exports = User;