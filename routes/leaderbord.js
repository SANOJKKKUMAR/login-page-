const express = require("express");
const router = express.Router();
const sequelize = require("../config/db");
const User = require("../models/user");
const Expense = require("../models/expenses");

// 🏆 Leaderboard — Show users with total money spent
router.get("/leaderboard", async (req, res) => {
  console.log("called ledarbord ");
  try {
    const leaderboard = await Expense.findAll({
      attributes: [
        "userID",
        [sequelize.fn("SUM", sequelize.col("amount")), "totalSpent"], // Total expense per user
      ],
      include: [
        {
          model: User,
          attributes: ["userID", "username", "email"], // Show user details
        },
      ],
      group: ["userID", "User.userID"], // Group by user
      order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]], // Sort by highest spender
    });

    res.json({
      success: true,
      message: "Leaderboard fetched successfully",
      data: leaderboard,
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch leaderboard",
      details: error.message,
    });
  }
});

module.exports = router;
