import express from "express";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const MERCHANT_ID = process.env.MERCHANT_ID;
const API_KEY = process.env.API_KEY;
const CRYPTOMUS_URL = "https://api.cryptomus.com/v1/payment";

// Helper: generate HMAC signature
function createSignature(data) {
  const jsonString = JSON.stringify(data);
  return crypto
    .createHmac("sha512", API_KEY)
    .update(jsonString)
    .digest("hex");
}

// Route: create a payment
app.post("/create-payment", async (req, res) => {
  try {
    const payload = {
      amount: "10",
      currency: "USDT",
      order_id: "order-" + Date.now(),
      url_callback: "http://localhost:4000/webhook", // points to webhook.js
      url_return: "http://localhost:3000/success",
    };

    const headers = {
      merchant: MERCHANT_ID,
      sign: createSignature(payload),
    };

    const response = await axios.post(CRYPTOMUS_URL, payload, { headers });
    res.json({
      payUrl: response.data.result.url,
      payForm: response.data.result.pay_form,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

app.listen(3000, () => {
  console.log("API server running on http://localhost:3000");
});

