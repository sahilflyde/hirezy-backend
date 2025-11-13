"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _deployControllersNew = require("../controllers/deployControllersNew.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post("/github", _deployControllersNew.deployToGitHub);
var _default = router;
exports["default"] = _default;