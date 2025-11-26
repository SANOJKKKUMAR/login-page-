const express = require("express");
const {
  forgetPassword,
  resetPassword,
  changePassword,
} = require("../controllers/forget-password");

const router = express.Router();

router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", changePassword);

module.exports = router;
