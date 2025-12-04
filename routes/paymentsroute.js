const{verifyOrder, createorder,premiumprofile,  } = require("../controllers/paymentController");
const express = require("express");
const route = express.Router();
route.post("/create-order" , createorder);
route.get("/profile/:id",premiumprofile);
route.get("/verify-order",verifyOrder);

module.exports = route;

