"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ComponentSchema = new _mongoose["default"].Schema({
  type: {
    type: String,
    required: true
  },
  props: {
    type: Object,
    "default": {}
  },
  children: {
    type: Array,
    "default": []
  }
}, {
  _id: false
});
var PageSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  components: {
    type: [ComponentSchema],
    "default": []
  },
  seo: {
    type: Object,
    "default": {}
  }
}, {
  _id: false
});
var WebsiteSchema = new _mongoose["default"].Schema({
  siteId: {
    type: String,
    required: true,
    unique: true
  },
  websiteName: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  domain: {
    type: String,
    "default": null
  },
  favicon: {
    type: String,
    "default": null
  },
  deploy: {
    type: Object,
    "default": {}
  },
  theme: {
    type: Object,
    "default": {}
  },
  analytics: {
    type: Object,
    "default": {}
  },
  pages: {
    type: [PageSchema],
    "default": []
  }
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("Website", WebsiteSchema);

exports["default"] = _default;