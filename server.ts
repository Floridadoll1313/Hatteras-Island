import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Stripe Checkout Endpoint
  app.post("/api/create-checkout-session", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." });
    }

    const { name, price, description, email } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: name,
                description: description || `Subscription for ${name}`,
              },
              unit_amount: Math.round(price * 100),
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.APP_URL}?status=success&plan=${encodeURIComponent(name)}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}?status=cancel`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Retrieve Checkout Session Endpoint
  app.get("/api/checkout-session/:sessionId", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured." });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      res.json({ customer: session.customer });
    } catch (error: any) {
      console.error("Stripe Retrieve Session Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Customer Portal Endpoint
  app.post("/api/create-portal-session", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured." });
    }

    const { customerId } = req.body;

    try {
      // In a real app, you'd fetch the customerId from your database
      // For this demo, if no customerId is provided, we can't create a portal session
      if (!customerId) {
        return res.status(400).json({ error: "Customer ID is required for portal access." });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: process.env.APP_URL,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Portal Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
