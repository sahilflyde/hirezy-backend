"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _domainController = require("../controllers/domainController.js");

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post("/add", _domainController.addDomain);
router.get("/status/:domain", _domainController.getDomainStatus);
router.post("/verify/:domain", _domainController.verifyDomain);
var _default = router;
exports["default"] = _default;