const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");  // Ensure you're using the sequelize instance

class SalaryHistory extends Model {}

SalaryHistory.init(
    {
        salary_history_id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        salary: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        salary_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "SalaryHistory",
        tableName: "salary_history",
    }
);
module.exports = SalaryHistory;