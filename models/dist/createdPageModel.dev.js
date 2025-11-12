"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// ---- Child component (for nested items like grid children) ----
var ChildComponentSchema = new _mongoose["default"].Schema({
  type: {
    type: String,
    required: true
  },
  props: {
    type: _mongoose["default"].Schema.Types.Mixed,
    "default": {}
  }
}, {
  _id: false
}); // ---- Component (can have children) ----

var ComponentSchema = new _mongoose["default"].Schema({
  type: {
    type: String,
    required: true
  },
  props: {
    type: _mongoose["default"].Schema.Types.Mixed,
    "default": {}
  },
  children: {
    type: [ChildComponentSchema],
    "default": []
  },
  styleOverrides: {
    type: _mongoose["default"].Schema.Types.Mixed,
    "default": {}
  }
}, {
  _id: false
}); // ---- Page (route + SEO + components) ----

var PageSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  // e.g. "/" | "/about"
  seo: {
    type: _mongoose["default"].Schema.Types.Mixed,
    "default": {}
  },
  components: {
    type: [ComponentSchema],
    "default": []
  }
}, {
  _id: false
}); // ---- Main Website (single-tenant: no ownerId) ----

var WebsiteSchema = new _mongoose["default"].Schema({
  siteId: {
    type: String,
    required: true,
    unique: true
  },
  // you can prefill with a uuid
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
    repoUrl: {
      type: String,
      "default": null
    },
    liveUrl: {
      type: String,
      "default": null
    },
    provider: {
      type: String,
      "default": "vercel"
    },
    // future: netlify, cloudflare
    status: {
      type: String,
      "enum": ["draft", "published", "failed"],
      "default": "draft"
    },
    lastPublishedAt: {
      type: Date,
      "default": null
    }
  },
  theme: {
    colors: {
      type: _mongoose["default"].Schema.Types.Mixed,
      "default": {}
    },
    typography: {
      type: _mongoose["default"].Schema.Types.Mixed,
      "default": {}
    },
    spacing: {
      type: _mongoose["default"].Schema.Types.Mixed,
      "default": {}
    },
    radius: {
      type: _mongoose["default"].Schema.Types.Mixed,
      "default": {}
    }
  },
  analytics: {
    ga4: {
      type: _mongoose["default"].Schema.Types.Mixed,
      "default": {}
    },
    // { measurementId }
    gtm: {
      type: _mongoose["default"].Schema.Types.Mixed,
      "default": {}
    },
    // { containerId }
    facebookPixel: {
      type: _mongoose["default"].Schema.Types.Mixed,
      "default": {}
    } // { pixelId }

  },
  pages: {
    type: [PageSchema],
    "default": []
  }
}, {
  timestamps: true
}); // helpful indexes

WebsiteSchema.index({
  slug: 1
}, {
  unique: true
});
WebsiteSchema.index({
  siteId: 1
}, {
  unique: true
});

var _default = _mongoose["default"].model("Website", WebsiteSchema);

exports["default"] = _default;