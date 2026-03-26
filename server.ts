import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required. Please add it in the AI Studio Secrets menu.');
    }
    // Clean the key: trim whitespace and remove accidental quotes
    const cleanKey = key.trim().replace(/^["']|["']$/g, '');
    stripeClient = new Stripe(cleanKey);
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Auth Middleware for Demo
  // In a real app, this would verify a Firebase ID token or session cookie
  app.use((req: any, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === 'Bearer mock-tribe-leader-token') {
      req.user = {
        id: 'user_123',
        role: 'TRIBE_LEADER',
        villageId: 'hatteras_village'
      };
    } else {
      req.user = {
        id: 'user_456',
        role: 'VILLAGER',
        villageId: 'hatteras_village'
      };
    }
    next();
  });

  // Express middleware for Tribe Leaders
  const authorizeTribeLeader = async (req: any, res: any, next: any) => {
    const { user } = req;
    
    // Verify if the user is a Tribe Leader for this specific Village
    if (user && user.role === 'TRIBE_LEADER' && user.villageId === req.params.villageId) {
      return next();
    }
    
    return res.status(403).json({ 
      message: "The Council has spoken: Only Tribe Leaders can manage these tools." 
    });
  };

  // API Route to unlock a new "Survival Toolbox" (Automation)
  app.patch('/api/village/:villageId/toolbox/:toolId', authorizeTribeLeader, async (req, res) => {
    const { villageId, toolId } = req.params;
    
    // Logic to 'Buy Back Time' by unlocking high-value business tools
    console.log(`Unlocking Survival Toolbox: ${toolId} for Village: ${villageId}`);
    
    res.json({
      success: true,
      message: `Survival Toolbox '${toolId}' has been successfully unlocked for ${villageId}.`,
      unlockedAt: new Date().toISOString(),
      toolDetails: {
        id: toolId,
        status: 'active',
        efficiencyBoost: '25%'
      }
    });
  });

  // Stripe Checkout Endpoint
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const stripe = getStripe();
      const { name, price, description, email } = req.body;

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
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      res.json({ customer: session.customer });
    } catch (error: any) {
      console.error("Stripe Retrieve Session Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Customer Portal Endpoint
  app.post("/api/create-portal-session", async (req, res) => {
    try {
      const stripe = getStripe();
      const { customerId } = req.body;

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

  app.get("/api/stripe-status", (req, res) => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return res.json({ status: 'not_configured' });
    }
    const isLive = key.startsWith('sk_live');
    res.json({ status: 'configured', mode: isLive ? 'live' : 'test' });
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
