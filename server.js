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
import domainRoutes from "./routes/domainRoutes.js"
import DomainMap from "./models/domainMapModel.js"
import CreatedPage from "./models/createdPageModel.js";

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


app.use("/api/domain", domainRoutes);



app.get("*", async (req, res) => {
  const host = req.headers.host;

  const map = await DomainMap.findOne({ domain: host, status: "verified" });
  if (!map) return res.send("🔴 Domain not configured!");

  const page = await CreatedPage.findOne({ slug: map.pageSlug });
  if (!page) return res.send("⚠️ Page not found!");

  return res.send(`
    <html>
      <head><title>${map.pageSlug}</title></head>
      <body>
        <div id="root"></div>
        <script>
          window.pageData = ${JSON.stringify(page.components)};
        </script>
        <script src="/main.js"></script>
      </body>
    </html>
  `);
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
