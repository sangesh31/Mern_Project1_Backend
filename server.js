// server.js
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Order = require("./orderModel");

// Load .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

if (!process.env.MONGO_URI) {
  console.error("❌ Missing MONGO_URI in backend/.env. Please set it before starting the server.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: "https://ordermenu.netlify.app", // Your frontend URL
  methods: ["GET", "POST", "PUT"],        // Allowed HTTP methods
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Optional: view all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save order
app.post("/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order saved!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
// Update order status by ID
app.put("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
