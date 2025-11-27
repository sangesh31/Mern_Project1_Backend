const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      qty: Number,
      price: Number
    }
  ],
  total: Number,
  status: { type: String, default: "Pending" }, // ✅ default status
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
