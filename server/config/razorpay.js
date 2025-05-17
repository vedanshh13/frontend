const Razorpay = require("razorpay");
require("dotenv").config(); // Always load this first

exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY || "rzp_test_yCdJquTC727i5J",      // ✅ Matches your .env key
  key_secret: process.env.RAZORPAY_SECRET || "Juc0iVr70zhj2f7w5n6Qfn9T",
});
