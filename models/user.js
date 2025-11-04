

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
});

module.exports = User;


// const User = sequelize.define('User', {

//    userID: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true
//     },
//     email : {type:DataTypes.STRING,allowNull :false},
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });
// module.exports = User;