

const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");



const User = sequelize.define("User", {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  premiumExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  supportNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentStatus :{
    type :DataTypes.STRING,
    defaultValue : "pendding",
    

  },
});

module.exports = User;

