// 🔴 FIX DNS SRV issue on Windows (MUST BE FIRST)
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ FIXED: Dynamic CORS for Local & Production
const allowedOrigins = [
  "http://localhost:5173", 
  "https://interaction-time-2bo5.vercel.app" // Your Vercel URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Deployment: Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(process.cwd(), "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "../frontend/dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

startServer();