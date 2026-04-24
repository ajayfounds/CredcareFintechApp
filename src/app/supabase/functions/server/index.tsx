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

// Types (Mirrors the frontend types)
type User = {
  id: string; // Added ID to user
  name: string;
  creditScore: number;
  scoreStatus: 'Needs Work' | 'Fair' | 'Good' | 'Excellent';
  lastUpdated: string;
  monthlyIncome: number;
};

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'missed';
  category: 'payment' | 'document' | 'education' | 'action';
  impact: 'high' | 'medium' | 'low';
};

type Loan = {
  id: string;
  lender: string;
  type: 'Personal Loan' | 'Credit Card' | 'Consumer Durable';
  amountDue: number;
  dueDate: string;
  status: 'ontime' | 'overdue' | 'closed';
  missedPayments: number;
};

type Insight = {
  id: string;
  title: string;
  description: string;
  type: 'negative' | 'positive' | 'neutral';
  date: string;
};

const BASE_PATH = "/make-server-007fe701";

// Mock Data for Seeding
const MOCK_USER: User = {
  id: "user_123",
  name: "Arjun",
  creditScore: 624,
  scoreStatus: 'Needs Work',
  lastUpdated: "2 Feb 2026",
  monthlyIncome: 35000,
};

const MOCK_LOANS: Loan[] = [
  {
    id: 'l1',
    lender: 'HDFC Bank',
    type: 'Personal Loan',
    amountDue: 4500,
    dueDate: '2026-02-05',
    status: 'ontime',
    missedPayments: 1
  },
  {
    id: 'l2',
    lender: 'SBI Card',
    type: 'Credit Card',
    amountDue: 12000,
    dueDate: '2026-02-10',
    status: 'ontime',
    missedPayments: 0
  },
  {
    id: 'l3',
    lender: 'Bajaj Finserv',
    type: 'Consumer Durable',
    amountDue: 1999,
    dueDate: '2026-01-15',
    status: 'overdue',
    missedPayments: 1
  }
];

const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Pay Bajaj Overdue',
    description: 'Clear the ₹1,999 pending amount to stop further score damage.',
    dueDate: 'Today',
    status: 'pending',
    category: 'payment',
    impact: 'high'
  },
  {
    id: 't2',
    title: 'Enable Auto-Pay for HDFC',
    description: 'Avoid accidental misses by setting up auto-debit for your loan.',
    dueDate: '2026-02-04',
    status: 'pending',
    category: 'action',
    impact: 'medium'
  },
  {
    id: 't3',
    title: 'Read: "How Interest Accumulates"',
    description: 'Understand why delaying payments costs more than just late fees.',
    dueDate: '2026-02-06',
    status: 'pending',
    category: 'education',
    impact: 'low'
  }
];

const MOCK_INSIGHTS: Insight[] = [
  {
    id: '1',
    title: 'Missed Payment Impact',
    description: 'Your score dropped by 42 points due to a missed HDFC EMI in December.',
    type: 'negative',
    date: 'Dec 2025'
  },
  {
    id: '2',
    title: 'High Utilization',
    description: 'Your SBI Card utilization is at 85%. Ideally, it should be below 30%.',
    type: 'negative',
    date: 'Jan 2026'
  },
  {
    id: '3',
    title: 'Credit Age',
    description: 'Your credit history is 1 year old. Keep accounts open to improve this.',
    type: 'neutral',
    date: 'Jan 2026'
  }
];


// Routes
app.get(`${BASE_PATH}/health`, (c) => {
  return c.json({ status: "ok" });
});

// Seed Data (Safe Idempotent)
app.post(`${BASE_PATH}/seed/:userId`, async (c) => {
  const userId = c.req.param("userId");
  
  // Check if exists
  const existingUser = await kv.get(`user:${userId}`);
  if (existingUser) {
    return c.json({ message: "Data already exists", seeded: false });
  }

  // Seed
  const user = { ...MOCK_USER, id: userId };
  await kv.set(`user:${userId}`, JSON.stringify(user));
  await kv.set(`loans:${userId}`, JSON.stringify(MOCK_LOANS));
  await kv.set(`tasks:${userId}`, JSON.stringify(MOCK_TASKS));
  await kv.set(`insights:${userId}`, JSON.stringify(MOCK_INSIGHTS));

  return c.json({ message: "Data seeded successfully", seeded: true });
});

// Get User
app.get(`${BASE_PATH}/user/:userId`, async (c) => {
  const userId = c.req.param("userId");
  const data = await kv.get(`user:${userId}`);
  if (!data) return c.json({ error: "User not found" }, 404);
  return c.json(JSON.parse(data));
});

// Create/Update User (Onboarding)
app.post(`${BASE_PATH}/user/:userId`, async (c) => {
  const userId = c.req.param("userId");
  const body = await c.req.json();
  
  // Merge with existing or create new
  const existingStr = await kv.get(`user:${userId}`);
  const existing = existingStr ? JSON.parse(existingStr) : { id: userId, creditScore: 600, scoreStatus: 'Fair', lastUpdated: new Date().toLocaleDateString() };
  
  const updated = { ...existing, ...body };
  await kv.set(`user:${userId}`, JSON.stringify(updated));
  
  // If new user, also seed default data if empty
  const tasks = await kv.get(`tasks:${userId}`);
  if (!tasks) {
     await kv.set(`loans:${userId}`, JSON.stringify(MOCK_LOANS));
     await kv.set(`tasks:${userId}`, JSON.stringify(MOCK_TASKS));
     await kv.set(`insights:${userId}`, JSON.stringify(MOCK_INSIGHTS));
  }

  return c.json(updated);
});

// Get Loans
app.get(`${BASE_PATH}/loans/:userId`, async (c) => {
  const userId = c.req.param("userId");
  const data = await kv.get(`loans:${userId}`);
  return c.json(data ? JSON.parse(data) : []);
});

// Get Tasks
app.get(`${BASE_PATH}/tasks/:userId`, async (c) => {
  const userId = c.req.param("userId");
  const data = await kv.get(`tasks:${userId}`);
  return c.json(data ? JSON.parse(data) : []);
});

// Update Task Status
app.post(`${BASE_PATH}/tasks/:userId/:taskId/complete`, async (c) => {
  const { userId, taskId } = c.req.param();
  const data = await kv.get(`tasks:${userId}`);
  if (!data) return c.json({ error: "No tasks found" }, 404);

  const tasks: Task[] = JSON.parse(data);
  const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: 'completed' as const } : t);
  
  await kv.set(`tasks:${userId}`, JSON.stringify(updatedTasks));
  return c.json(updatedTasks);
});

// Get Insights
app.get(`${BASE_PATH}/insights/:userId`, async (c) => {
  const userId = c.req.param("userId");
  const data = await kv.get(`insights:${userId}`);
  return c.json(data ? JSON.parse(data) : []);
});

Deno.serve(app.fetch);
