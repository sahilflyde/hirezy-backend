"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _createdWebsiteController = require("../controllers/createdWebsiteController.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get("/check-slug/:slug", _createdWebsiteController.checkSlug);
router.post("/save", _createdWebsiteController.saveWebsite);
router.get("/:slug", _createdWebsiteController.getWebsiteBySlug);
router.get("/", _createdWebsiteController.getAllWebsites);
router["delete"]("/:slug", _createdWebsiteController.deleteWebsite);
var _default = router;
exports["default"] = _default;