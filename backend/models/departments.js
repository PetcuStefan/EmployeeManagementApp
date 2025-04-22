const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

class Department extends Model {}

Department.init(
  {
    department_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,  // Sequelize instance
    modelName: "Department",
    tableName: "departments",
    timestamps: true,
  }
);

module.exports = Department;
