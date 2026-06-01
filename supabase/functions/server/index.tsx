import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-007fe701/health", (c) => {
  return c.json({ status: "ok" });
});

// Seed user data endpoint
app.post("/make-server-007fe701/seed/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    console.log(`Seeding data for user: ${userId}`);

    // Seed user data
    const userData = {
      name: "Rahul",
      creditScore: 624,
      scoreStatus: "Needs Work",
      lastUpdated: "Just now"
    };
    await kv.set(`user:${userId}`, userData);
    console.log(`User data seeded for ${userId}`);

    // Seed tasks data
    const tasksData = [
      {
        id: '1',
        title: "Pay HDFC Credit Card",
        description: "Minimum due payment to avoid late fees. This will positively impact your payment history.",
        dueDate: "Today",
        status: "pending",
        category: "payment",
        impact: "high",
        amount: 15400,
        provider: "HDFC Bank"
      },
      {
        id: '2',
        title: "Upload Income Proof",
        description: "Update your income details to increase credit limit eligibility. Please provide your latest payslip.",
        dueDate: "Tomorrow",
        status: "pending",
        category: "document",
        impact: "medium",
        documentType: "Payslip / IT Return"
      },
      {
        id: '3',
        title: "Dispute CIBIL Error",
        description: "You flagged an unknown loan inquiry. Review the dispute form before submission.",
        dueDate: "Fri, Feb 14",
        status: "pending",
        category: "review",
        impact: "high"
      },
      {
        id: '4',
        title: "Setup Auto-pay",
        description: "Never miss a payment by enabling auto-debit for your SBI Loan.",
        dueDate: "Next Week",
        status: "pending",
        category: "generic",
        impact: "medium"
      },
      {
        id: '5',
        title: "Verify Email",
        description: "Complete your profile verification.",
        dueDate: "Past",
        status: "completed",
        category: "generic",
        impact: "low"
      }
    ];
    await kv.set(`tasks:${userId}`, tasksData);
    console.log(`Tasks data seeded for ${userId}`);

    return c.json({ success: true, message: "Data seeded successfully" });
  } catch (err) {
    console.error("Error seeding data:", err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Get user data endpoint
app.get("/make-server-007fe701/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userData = await kv.get(`user:${userId}`);

    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    return c.json({ error: err.message }, 500);
  }
});

// Get tasks endpoint
app.get("/make-server-007fe701/tasks/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const tasksData = await kv.get(`tasks:${userId}`);

    if (!tasksData) {
      return c.json([]);
    }

    return c.json(tasksData);
  } catch (err) {
    console.error("Error fetching tasks data:", err);
    return c.json({ error: err.message }, 500);
  }
});

Deno.serve(app.fetch);