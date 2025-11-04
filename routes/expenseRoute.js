const express  = require("express");
const route = express.Router();

const expenseroute = require("../controllers/expenseController");


route.post("/expense",expenseroute.addExpense);
route.get("/expense/:id",expenseroute.getExpensebyID);
route.delete("/expense/:id",expenseroute.deleteExpense);
route.put("/expense/:id" , expenseroute.updateExpense);
route.get("/expenses/:id",expenseroute.getExpensesByUser);


module.exports = route;