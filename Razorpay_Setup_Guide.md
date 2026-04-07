# Comprehensive Razorpay Setup Guide for Brickova

This guide outlines the steps to finalize and secure the Razorpay integration in your Brickova real estate website.

## 1. Obtain Your Razorpay API Keys

To start accepting real payments, you need official keys from the Razorpay Dashboard.

1.  **Sign Up / Log In**: Go to [Razorpay Dashboard](https://dashboard.razorpay.com/).
2.  **Toggle Mode**: Start with **Test Mode** (top-right switcher) for development.
3.  **Generate Keys**:
    - Navigate to **Settings** > **API Keys**.
    - Click **Generate Key ID and Secret**.
    - **IMPORTANT**: Download the key details immediately and keep them secure. You will not see the Secret again.

## 2. Configure Environment Variables

Create or update your `.env` file in the project root directory.

```bash
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_YourGeneratedKeyID
```

> [!TIP]
> Do NOT expose your `KEY_SECRET` in the frontend (the `.env` file with `VITE_` prefix is for client-side use). The Secret should only be used on a secure backend.

## 3. Implementation Overview

The integration is split into three main parts:

### A. The SDK Loading (`index.html`)
The Razorpay library is loaded via a standard script tag, making the `window.Razorpay` object available globally.

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### B. The Payment Service (`services/paymentService.ts`)
This service handles the logic for opening the Checkout modal. It pre-fills user information to ensure a high-conversion experience.

```typescript
// Key highlights of the implementation:
const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Uses your .env key
  amount: plan.price * 100,                  // Convert INR to Paise
  handler: function (response) { ... },      // Triggers on success
  prefill: { ... },                          // Name, Email, Phone
  theme: { color: "#0f172a" },               // Brickova Navy
};
```

### C. The Application Flow (`App.tsx`)
When a user chooses a plan, the app now follows this sequence:
1. Check if the plan is paid (Price > 0).
2. Trigger the `initializePayment` service.
3. Wait for the user to complete the transaction.
4. On success, update the plan in the database (Firestore).

## 4. Moving to Production

For a production-ready system, follow these security best practices:

1.  **Backend Verification**: Currently, the system updates the plan based on the client-side success callback. For security, you should send the `razorpay_payment_id` to a backend server to verify the payment with Razorpay's API using your `KEY_SECRET`.
2.  **Webhooks**: Set up webhooks in the Razorpay Dashboard to handle cases where a user closes their browser after payment but before the success callback finishes.
3.  **Switch to Live Mode**: Once testing is complete, switch to **Live Mode** in the dashboard, generate new keys, and update your `.env` with the Production Key ID.

## 5. Testing the Integration

While in **Test Mode**, you can use dummy card details provided by Razorpay (e.g., Card Number `4111 1111 ...`) to simulate successful and failed payments without using real money.

---

> [!NOTE]
> If you need help setting up a Node.js backend for payment verification, just ask and I can provide a template!
