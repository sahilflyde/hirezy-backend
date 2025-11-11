"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DomainMapSchema = new _mongoose["default"].Schema({
  domain: {
    type: String,
    required: true,
    unique: true
  },
  pageSlug: {
    type: String,
    required: true
  },
  status: {
    type: String,
    "default": "pending"
  },
  verificationToken: {
    type: String
  }
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("DomainMap", DomainMapSchema);

exports["default"] = _default;