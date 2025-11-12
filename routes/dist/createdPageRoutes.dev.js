"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _websiteController = require("../controllers/websiteController.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get("/check-slug/:slug", _websiteController.checkSlug);
router.post("/save", _websiteController.saveWebsite);
router.get("/:slug", _websiteController.getWebsiteBySlug);
router.get("/", _websiteController.getAllWebsites);
router["delete"]("/:slug", _websiteController.deleteWebsite);
var _default = router;
exports["default"] = _default;