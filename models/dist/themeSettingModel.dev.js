"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var themeSettingSchema = new _mongoose["default"].Schema({
  theme: {
    type: String,
    "enum": ["light", "dark"],
    "default": "light"
  }
});

var _default = _mongoose["default"].model("ThemeSetting", themeSettingSchema);

exports["default"] = _default;