const functions = require("firebase-functions");
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "https://rajyuvrajfood.co.in", "https://movie-fbd7f.web.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight
app.options("*", cors());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.API_KEY,
  key_secret: process.env.SECRET_KEY,
});

app.get("/show-keys", (req, res) => {
  res.json({
    key_id: process.env.API_KEY,
    key_secret: process.env.SECRET_KEY,
  });
});


// Create Order
app.post("/create-order", async (req, res) => {
  try {
    const { amount, receipt } = req.body;

    const options = {
      amount,
      currency: "INR",
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/", (req, res) => {
  res.send("API root working!", process.env.API_KEY, process.env.SECRET_KEY);
});

// Verify Payment
app.post("/verify-payment", (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature === signature) {
      res.status(200).json({ valid: true });
    } else {
      res.status(400).json({ valid: false, error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});


// Expose APIs as Firebase functions
exports.api = functions.https.onRequest(app);

// Simple test endpoint
exports.testRoute = functions.https.onRequest((req, res) => {
  res.send("Test route working!");
});
