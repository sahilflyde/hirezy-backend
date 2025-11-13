"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _db = _interopRequireDefault(require("./config/db.js"));

var _getStartedFormRoutes = _interopRequireDefault(require("./routes/getStartedFormRoutes.js"));

var _joinOurTeamRoutes = _interopRequireDefault(require("./routes/joinOurTeamRoutes.js"));

var _agencyPartnershipRoutes = _interopRequireDefault(require("./routes/agencyPartnershipRoutes.js"));

var _subscriptionRoutes = _interopRequireDefault(require("./routes/subscriptionRoutes.js"));

var _auth = _interopRequireDefault(require("./routes/auth.js"));

var _successStoryRoutes = _interopRequireDefault(require("./routes/successStoryRoutes.js"));

var _heroRoutes = _interopRequireDefault(require("./routes/heroRoutes.js"));

var _teamsSectionRoutes = _interopRequireDefault(require("./routes/teamsSectionRoutes.js"));

var _aboutRoutes = _interopRequireDefault(require("./routes/aboutRoutes.js"));

var _whyChooseRoutes = _interopRequireDefault(require("./routes/whyChooseRoutes.js"));

var _featuresSectionRoutes = _interopRequireDefault(require("./routes/featuresSectionRoutes.js"));

var _transformSectionRoutes = _interopRequireDefault(require("./routes/transformSectionRoutes.js"));

var _metricsSectionRoutes = _interopRequireDefault(require("./routes/metricsSectionRoutes.js"));

var _integrationSectionRoutes = _interopRequireDefault(require("./routes/integrationSectionRoutes.js"));

var _pricingSectionRoutes = _interopRequireDefault(require("./routes/pricingSectionRoutes.js"));

var _faqRoutes = _interopRequireDefault(require("./routes/faqRoutes.js"));

var _footerRoutes = _interopRequireDefault(require("./routes/footerRoutes.js"));

var _testimonialsRoutes = _interopRequireDefault(require("./routes/testimonialsRoutes.js"));

var _headerRoutes = _interopRequireDefault(require("./routes/headerRoutes.js"));

var _createdWebsitesRoutes = _interopRequireDefault(require("./routes/createdWebsitesRoutes.js"));

var _domainRoutes = _interopRequireDefault(require("./routes/domainRoutes.js"));

var _themeSettingRoutes = _interopRequireDefault(require("./routes/themeSettingRoutes.js"));

var _socket = require("socket.io");

var _http = _interopRequireDefault(require("http"));

var _deployRoutesNew = _interopRequireDefault(require("./routes/deployRoutesNew.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Load environment variables
_dotenv["default"].config(); // Connect to MongoDB


(0, _db["default"])(); // Initialize Express app

var app = (0, _express["default"])(); // CORS Configuration

var corsOptions = ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "https://gtw-admin.vercel.app", "https://gtw-admin.vercel.app/", "https://generaltechworks.com", "https://hirezy-web.vercel.app", "http://localhost:5050", "https://hirezy-admin.vercel.app", "https://hirezy-frontend.vercel.app", "*"]; // Middleware

app.use((0, _cors["default"])({
  origin: corsOptions,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.options("*", (0, _cors["default"])(corsOptions)); // Handle preflight requests

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
})); // Routes

app.get("/", function (req, res) {
  res.json({
    message: "Welcome to GTW Backend API"
  });
}); // API Routes

app.use("/api/auth", _auth["default"]);
app.use("/api/form", _getStartedFormRoutes["default"]);
app.use("/api/join-team", _joinOurTeamRoutes["default"]);
app.use("/api/agency-partnership", _agencyPartnershipRoutes["default"]);
app.use("/api/subscriptions", _subscriptionRoutes["default"]);
app.use("/api/success-stories", _successStoryRoutes["default"]);
app.use("/api/hero", _heroRoutes["default"]);
app.use("/api/teams-section", _teamsSectionRoutes["default"]);
app.use("/api/about", _aboutRoutes["default"]);
app.use("/api/why-choose", _whyChooseRoutes["default"]);
app.use("/api/features-section", _featuresSectionRoutes["default"]);
app.use("/api/transform-section", _transformSectionRoutes["default"]);
app.use("/api/metrics-section", _metricsSectionRoutes["default"]);
app.use("/api/integration-section", _integrationSectionRoutes["default"]);
app.use("/api/pricing-section", _pricingSectionRoutes["default"]);
app.use("/api/faq-section", _faqRoutes["default"]);
app.use("/api/footer-section", _footerRoutes["default"]);
app.use("/api/testimonial-section", _testimonialsRoutes["default"]);
app.use("/api/header-section", _headerRoutes["default"]);
app.use("/api/websites", _createdWebsitesRoutes["default"]);
app.use("/api", _themeSettingRoutes["default"]);
app.use("/api/domain", _domainRoutes["default"]);
app.use("/api/deploy", _deployRoutesNew["default"]);

var server = _http["default"].createServer(app);

var io = new _socket.Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "https://hirezy-frontend.vercel.app", "*"],
    methods: ["GET", "POST"]
  }
});
global.io = io; // Error handling middleware

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message
  });
}); // Start server

var PORT = 5000;
server.listen(PORT, function () {
  console.log("Server + Socket running on port ".concat(PORT));
});