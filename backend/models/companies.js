const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");  // Ensure you're using the sequelize instance

class Company extends Model {}

Company.init(
  {
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
    header_image_path: {
      type:DataTypes.STRING,
      allowNull:true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,  // Sequelize instance
    modelName: "Company",  // This is the name of the model (in singular)
    tableName: "companies",  // Table name in DB
    timestamps: true,  // Automatically adds `createdAt` and `updatedAt`
  }
);

module.exports = Company;
