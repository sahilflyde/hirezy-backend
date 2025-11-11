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
import createdPageRoutes from "./routes/createdPageRoutes.js";
import domainRoutes from "./routes/domainRoutes.js";
import DomainMap from "./models/domainMapModel.js";
import CreatedPage from "./models/createdPageModel.js";
import themeSettingRoutes from "./routes/themeSettingRoutes.js";
import { Server } from "socket.io";
import http from "http";
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://gtw-admin.vercel.app",
  "https://gtw-admin.vercel.app/",
  "https://generaltechworks.com",
  "https://hirezy-web.vercel.app",
  "http://localhost:5050",
  "https://hirezy-admin.vercel.app",
  "https://hirezy-frontend.vercel.app",
  "*",
];

// Middleware
app.use(
  cors({
    origin: corsOptions,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
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
app.use("/api/createdpage", createdPageRoutes);
app.use("/api", themeSettingRoutes);
app.use("/api/domain", domainRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://hirezy-frontend.vercel.app",
      "*",
    ],
    methods: ["GET", "POST"],
  },
});

global.io = io;

app.get("*", async (req, res) => {
  try {
    let host = req.headers.host;

    if (!host) return res.status(400).send("❌ Host header missing");

    // ✅ remove www.
    host = host.replace("www.", "");

    console.log("🌐 Incoming domain:", host);

    // ✅ find domain mapping in DB
    const map = await DomainMap.findOne({ domain: host, status: "verified" });
    if (!map) {
      console.log("❌ Domain not found or not verified");
      return res.send("🔴 Domain not configured or pending verification.");
    }

    // ✅ get linked page
    const page = await CreatedPage.findOne({ slug: map.pageSlug });
    if (!page) {
      console.log("⚠ Page not found for slug:", map.pageSlug);
      return res.send("⚠ Page not found! Ask admin to publish again.");
    }

    // ✅ Render HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${page.title || map.pageSlug}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta charset="UTF-8" />
          <style>
            body { margin:0; padding:0; font-family: sans-serif; }
          </style>
        </head>
        <body>
          <div id="root"></div>

          <script>
            window.pageData = ${JSON.stringify(page.components)};
          </script>

          <script src="/main.js"></script>
        </body>
      </html>
    `;

    return res.status(200).send(html);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).send("⚠ Server error occurred");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket running on port ${PORT}`);
});
