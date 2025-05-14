const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");  // Ensure you're using the sequelize instance

class ManagerHistory extends Model {}

ManagerHistory.init(
    {
        manager_history_id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        manager_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        manager_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ManagerHistory",
        tableName: "manager_history",
    }
);
module.exports = ManagerHistory;