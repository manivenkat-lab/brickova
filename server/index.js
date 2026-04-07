
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Endpoint to create an order
app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise for INR)
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');
  }
});

// Endpoint to verify payment signature
app.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Payment verified
    res.json({ status: 'success', message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ status: 'failure', message: 'Invalid signature' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Razorpay Backend running on port ${PORT}`);
});
