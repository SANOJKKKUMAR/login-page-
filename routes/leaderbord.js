const {leaderboard} = require("../controllers/leaderbordController");
const express = require("express");
const route = express.Router();

route.get("/leaderboard",leaderboard);

module.exports = route;


