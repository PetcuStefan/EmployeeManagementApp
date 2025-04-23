const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");  // Ensure you're using the sequelize instance

class Employee extends Model {}

Employee.init(
    {
        employee_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        department_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        manager_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hire_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,  // Sequelize instance
        modelName: "Employee",
        tableName: "employees",
    }
);

module.exports = Employee;