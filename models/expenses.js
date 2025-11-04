

const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");
const User = require("../models/user");

const expense = sequelize.define('Expense', {
    expenseID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    userID: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


User.hasMany(expense, { foreignKey: 'userID' });
expense.belongsTo(User, { foreignKey: 'userID' });
module.exports = expense;