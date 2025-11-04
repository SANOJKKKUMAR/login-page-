const express = require("express");
const { Cashfree, CFEnvironment } = require("cashfree-pg");
require("dotenv").config();
const axios = require("axios");
const router = express.Router();
const User = require("../models/user");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

// 🟢 CREATE ORDER
router.post("/create-order", async (req, res) => {
  console.log("payment request come");
  try {
    const { amount, userId } = req.body;

    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: "order_" + Date.now(),
      customer_details: {
        customer_id: "user_" + userId,
        customer_phone: "8102485837",
      },
      order_meta: {
        return_url:
          "https://gasometric-regenia-surprisingly.ngrok-free.dev/success.html?order_id={order_id}",
      },
    };

    const response = await cashfree.PGCreateOrder(request);
    console.log("Order created successfully:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// 🟢 USER PROFILE (premium info)
router.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      isPremium: user.isPremium,
      premiumExpiry: user.premiumExpiry,
      supportNumber: user.supportNumber,
      username: user.username,
    });
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟢 VERIFY ORDER (और यही premium activate करेगा)
router.get("/verify-order", async (req, res) => {
  console.log("verify payment is calling =============================================");
  const orderId = req.query.order_id;
  console.log("orderid ============================================?---orderid",orderId);
  if (!orderId) return res.status(400).json({ error: "order_id required" });

  try {
    const url = `https://sandbox.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`;
    const response = await axios.get(url, {
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2025-01-01",
      },
    });

    const data = response.data;
    console.log("✅ ================================Order Verified:", data);

    // ✅ अगर payment successful है तो user को premium बना दो
    if (data.order_status === "PAID") {
      const userID = data.customer_details.customer_id.replace("user_", "");
      console.log("=======================================================userid ",userID);
      const user = await User.findByPk(userID);


      if (user) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        await user.update({
          isPremium: true,
          premiumExpiry: expiryDate,
          supportNumber: "+91-8102485837",
        });

        console.log(`🎉 ${user.username} upgraded to Premium till ${expiryDate}`);
      }
    }

    res.json({
      order_status: data.order_status,
      order_amount: data.order_amount,
      cf_order_id: data.cf_order_id,
      created_at: data.created_at,
    });
  } catch (error) {
    console.error("❌ verify-order error:", error.response?.data || error.message);
    res.status(500).json({ error: "Could not verify order", details: error.message });
  }
});

module.exports = router;




// router.get('/profile/:id', async (req, res) => {
//   const orderId = req.query.order_id;
//   if (!orderId) return res.status(400).json({ error: 'order_id required' });

//   try {
//     const url = `https://sandbox.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`;
//     const response = await axios.get(url, {
//       headers: {
//         'x-client-id': process.env.CASHFREE_APP_ID,
//         'x-client-secret': process.env.CASHFREE_SECRET_KEY,
//         'x-api-version': '2025-01-01'
//       }
//     });

//     const d = response.data;

//     // ✅ Check payment success
//     if (d.order_status === 'PAID') {
//       const userId = d.customer_details?.customer_id?.replace('user_', '');

//       // Find user
//       const user = await User.findByPk(userId);
//       if (user) {
//         const expiryDate = new Date();
//         expiryDate.setDate(expiryDate.getDate() + 30); // valid for 30 days

//         await user.update({
//           isPremium: true,
//           premiumExpiry: expiryDate,
//           supportNumber: "+91-8102485837"
//         });

//         console.log(`✅ ${user.username} is now a Premium User until ${expiryDate}`);
//       }
//     }

//     return res.json({
//       order_status: d.order_status,
//       order_amount: d.order_amount,
//       cf_order_id: d.cf_order_id,
//       created_at: d.created_at
//     });
//   } catch (err) {
//     console.error('verify-order error', err.response?.data || err.message);
//     return res.status(500).json({ error: 'Could not verify order', details: err.message });
//   }
// });