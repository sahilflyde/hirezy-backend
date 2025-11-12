"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteWebsite = exports.getAllWebsites = exports.getWebsiteBySlug = exports.saveWebsite = exports.checkSlug = void 0;

var _Website = _interopRequireDefault(require("../models/Website.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var checkSlug = function checkSlug(req, res) {
  var exists;
  return regeneratorRuntime.async(function checkSlug$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_Website["default"].findOne({
            slug: req.params.slug
          }));

        case 3:
          exists = _context.sent;
          res.json({
            exists: !!exists
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: "Server error"
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.checkSlug = checkSlug;

var saveWebsite = function saveWebsite(req, res) {
  var _req$body, siteId, websiteName, slug, domain, favicon, deploy, theme, analytics, pages, site;

  return regeneratorRuntime.async(function saveWebsite$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, siteId = _req$body.siteId, websiteName = _req$body.websiteName, slug = _req$body.slug, domain = _req$body.domain, favicon = _req$body.favicon, deploy = _req$body.deploy, theme = _req$body.theme, analytics = _req$body.analytics, pages = _req$body.pages;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_Website["default"].findOneAndUpdate({
            siteId: siteId
          }, {
            siteId: siteId,
            websiteName: websiteName,
            slug: slug,
            domain: domain,
            favicon: favicon,
            deploy: deploy,
            theme: theme,
            analytics: analytics,
            pages: pages
          }, {
            "new": true,
            upsert: true
          }));

        case 4:
          site = _context2.sent;
          res.json({
            success: true,
            site: site
          });
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: "Server error"
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.saveWebsite = saveWebsite;

var getWebsiteBySlug = function getWebsiteBySlug(req, res) {
  var site;
  return regeneratorRuntime.async(function getWebsiteBySlug$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_Website["default"].findOne({
            slug: req.params.slug
          }));

        case 3:
          site = _context3.sent;

          if (site) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "Website not found"
          }));

        case 6:
          res.json(site);
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: "Server error"
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getWebsiteBySlug = getWebsiteBySlug;

var getAllWebsites = function getAllWebsites(req, res) {
  var sites;
  return regeneratorRuntime.async(function getAllWebsites$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_Website["default"].find().sort({
            createdAt: -1
          }));

        case 3:
          sites = _context4.sent;
          res.json(sites);
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: "Server error"
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getAllWebsites = getAllWebsites;

var deleteWebsite = function deleteWebsite(req, res) {
  return regeneratorRuntime.async(function deleteWebsite$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_Website["default"].deleteOne({
            slug: req.params.slug
          }));

        case 3:
          res.json({
            success: true
          });
          _context5.next = 9;
          break;

        case 6:
          _context5.prev = 6;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            error: "Server error"
          });

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.deleteWebsite = deleteWebsite;