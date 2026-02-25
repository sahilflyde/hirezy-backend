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
import aboutRoutes from "./routes/aboutRoutes.js";
import whyChooseRoutes from "./routes/whyChooseRoutes.js";
import featureSectionRoutes from "./routes/featuresSectionRoutes.js";
import transformSectionRoutes from "./routes/transformSectionRoutes.js";
import metricsSectionRoutes from "./routes/metricsSectionRoutes.js";
import integrationSectionRoutes from "./routes/integrationSectionRoutes.js";
import pricingSectionRoutes from "./routes/pricingSectionRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import footerRoutes from "./routes/footerRoutes.js";
import testimonialSectionRoutes from "./routes/testimonialsRoutes.js";
import headerSectionRoutes from "./routes/headerRoutes.js";
import createdWebsiteRoutes from "./routes/createdWebsitesRoutes.js";
import domainRoutes from "./routes/domainRoutes.js";
import themeSettingRoutes from "./routes/themeSettingRoutes.js";
import deployRoutes from "./routes/deployRoutesNew.js";
import { Server } from "socket.io";
import http from "http";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://hirezy-theme.vercel.app",
  "https://hirezy-frontend.vercel.app",
  "https://hirezy-admin.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow Postman/server-to-server

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* =========================
   ROUTES
========================= */

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
app.use("/api/about", aboutRoutes);
app.use("/api/why-choose", whyChooseRoutes);
app.use("/api/features-section", featureSectionRoutes);
app.use("/api/transform-section", transformSectionRoutes);
app.use("/api/metrics-section", metricsSectionRoutes);
app.use("/api/integration-section", integrationSectionRoutes);
app.use("/api/pricing-section", pricingSectionRoutes);
app.use("/api/faq-section", faqRoutes);
app.use("/api/footer-section", footerRoutes);
app.use("/api/testimonial-section", testimonialSectionRoutes);
app.use("/api/header-section", headerSectionRoutes);
app.use("/api/websites", createdWebsiteRoutes);
app.use("/api", themeSettingRoutes);
app.use("/api/domain", domainRoutes);
app.use("/api/deploy", deployRoutes);

/* =========================
   SOCKET.IO
========================= */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket running on port ${PORT}`);
});
