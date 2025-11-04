const  express = require("express");
const route = express.Router();
const userController = require("../controllers/userControllers");

route.post("/register",userController.register);
route.post("/login",userController.loginUSer);

module.exports = route;