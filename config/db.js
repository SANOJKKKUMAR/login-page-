const {Sequelize}  = require("sequelize");

const sequelize = new Sequelize('login','root', 'Sanoj@500r7', {
    host: 'localhost',
    dialect: 'mysql'
});
module.exports = sequelize;