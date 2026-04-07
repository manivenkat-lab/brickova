declare global {
  interface Window {
    Razorpay: any;
  }
}

export const initializePayment = async (plan: { name: string; price: number; id: string }, user: { email?: string; name?: string; phone?: string }): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please check your internet connection.");
        resolve(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
        amount: plan.price * 100, 
        currency: "INR",
        name: "Brickova CRM",
        description: `Subscription: ${plan.name}`,
        image: "https://images.unsplash.com/photo-1600585154340-be6199ec9a09?auto=format&fit=crop&q=80&w=100", 
        handler: function (response: any) {
          console.log("Payment Successful:", response);
          resolve(true);
        },
        prefill: {
          name: user.name || "Real Estate Pro",
          email: user.email || "pro@brickova.com",
          contact: user.phone || "9999999999",
        },
        notes: {
          plan_id: plan.id,
        },
        theme: {
          color: "#0f172a", 
        },
        modal: {
          ondismiss: function() {
            console.log("Payment Modal Dismissed");
            resolve(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      
      if (!rzp1 || typeof rzp1.open !== 'function') {
        throw new Error("Razorpay instance initialization failed");
      }
      
      rzp1.open();
    } catch (error) {
      console.error("Razorpay UI Error:", error);
      alert("Could not initialize the payment interface. Please ensure you are using a valid Razorpay Key ID.");
      resolve(false);
    }
  });
};
