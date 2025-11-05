import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import getStartedFormRoutes from "./routes/getStartedFormRoutes.js";
import joinOurTeamRoutes from "./routes/joinOurTeamRoutes.js";
import agencyPartnershipRoutes from "./routes/agencyPartnershipRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import authRoutes from "./routes/auth.js";
import successStoryRoutes from "./routes/successStoryRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import teamsSectionRoutes from "./routes/teamsSectionRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js"

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://gtw-admin.vercel.app",
    "https://gtw-admin.vercel.app/",
    "https://generaltechworks.com",
    "https://www.generaltechworks.com",
    "http://localhost:5050",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to GTW Backend API" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/form", getStartedFormRoutes);
app.use("/api/join-team", joinOurTeamRoutes);
app.use("/api/agency-partnership", agencyPartnershipRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/success-stories", successStoryRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/teams-section", teamsSectionRoutes);
app.use("/api/about", aboutRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
