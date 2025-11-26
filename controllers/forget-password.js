const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/user");   // Sequelize model
require("dotenv").config();


// =========================
//  PASSWORD HELPERS
// =========================
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};


// =========================
//  1. FORGOT PASSWORD
// =========================
const forgetPassword = async (req, res) => {
  console.log("Forget password request received");
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide email" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register." });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MY_GMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset link sent to your Gmail account",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};


// =========================
//  2. RESET PASSWORD
// =========================
const resetPassword = async (req, res) => {
  console.log("Reset password request received");
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Please provide password" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await hashPassword(password);

    await User.update(
      { password: hashedPassword },
      { where: { email: decoded.email } }
    );

    res.status(200).json({
      message: "Password reset successfully",
      redirect: process.env.frontend_url
    });
  } catch (error) {
    res.status(500).json({
      message: "Invalid or expired token",
      error,
    });
  }
};


// =========================
//  3. CHANGE PASSWORD (logged-in user)
// =========================
const changePassword = async (req, res) => {
  console.log("Change password request received");
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await User.update(
      { password: hashedNewPassword },
      { where: { email } }
    );

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};


module.exports = {
  forgetPassword,
  resetPassword,
  changePassword,
};




















// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const User = require("../models/userModel");
// const { hashPassword, comparePassword } = require("../secure/haspassword");

// const forgetPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).send({ message: "Please provide email" });
//     }

// const checkUser = await User.findOne({ where: { email } });


//     if (!checkUser) {
//       return res
//         .status(400)
//         .send({ message: "User not found please register" });
//     }

//     const token = jwt.sign({ email }, process.env.jwt_secret_key, {
//       expiresIn: "1h",
//     });

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       secure: true,
//       auth: {
//         user: process.env.MY_GMAIL,
//         pass: process.env.MY_GMAIL_PASSWORD,
//       },
//     });

//     const receiver = {
//       from: "kumarsanoj7108@gmail.com",
//       to: email,
//       subject: "Password Reset Request",
//       text: `Click on this link to generate your new password ${process.env.CLIENT_URL}/reset-password/${token}`,
//     };

//     await transporter.sendMail(receiver);

//     return res.status(200).send({
//       message: "Password reset link send successfully on your gmail account",
//     });
//   } catch (error) {
//     return res.status(500).send({ message: "Something went wrong" });
//   }
// };

// const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     if (!password) {
//       return res.status(400).send({ message: "Please provide password" });
//     }

//     const decode = jwt.verify(token, process.env.jwt_secret_key);
//     const user = await User.findOne({ where: { email: decode.email } });

//     const newhashPassword = await hashPassword(password);

//     user.password = newhashPassword;
//     await user.save();

//     return res.status(200).send({ message: "Password reset successfully" });
//   } catch (error) {
//     return res.status(500).send({ message: "Something went wrong" });
//   }
// };

// const changePassword = async (req, res) => {
//   try {
//     const { email, currentPassword, newPassword } = req.body;

//     if (!email || !currentPassword || !newPassword) {
//       return res
//         .status(400)
//         .send({ message: "Please provide all required fields" });
//     }

//     const checkUser = await User.findOne({ email });

//     if (!checkUser) {
//       return res
//         .status(400)
//         .send({ message: "User not found please register" });
//     }

//     const isMatchPassword = await comparePassword(
//       currentPassword,
//       checkUser.password
//     );

//     if (!isMatchPassword) {
//       return res
//         .status(400)
//         .send({ message: "Current password does not match" });
//     }

//     const newHashPassword = await hashPassword(newPassword);

//     await User.updateOne({ email }, { password: newHashPassword });

//     return res.status(200).send({ message: "Password change successfully" });
//   } catch (error) {
//     return res.status(500).send({ message: "Something went wrong" });
//   }
// };


// module.exports = {
//   forgetPassword,
//   resetPassword,
//   changePassword,
// };