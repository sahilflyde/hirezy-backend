"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateThemeSetting = exports.getThemeSetting = void 0;

var _themeSettingModel = _interopRequireDefault(require("../models/themeSettingModel.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getThemeSetting = function getThemeSetting(req, res) {
  var setting;
  return regeneratorRuntime.async(function getThemeSetting$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_themeSettingModel["default"].findOne());

        case 2:
          setting = _context.sent;

          if (setting) {
            _context.next = 7;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(_themeSettingModel["default"].create({
            theme: "light"
          }));

        case 6:
          setting = _context.sent;

        case 7:
          res.json({
            success: true,
            theme: setting.theme
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getThemeSetting = getThemeSetting;

var updateThemeSetting = function updateThemeSetting(req, res) {
  var theme, setting;
  return regeneratorRuntime.async(function updateThemeSetting$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          theme = req.body.theme;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_themeSettingModel["default"].findOne());

        case 3:
          setting = _context2.sent;

          if (setting) {
            _context2.next = 10;
            break;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(_themeSettingModel["default"].create({
            theme: theme
          }));

        case 7:
          setting = _context2.sent;
          _context2.next = 13;
          break;

        case 10:
          setting.theme = theme;
          _context2.next = 13;
          return regeneratorRuntime.awrap(setting.save());

        case 13:
          if (global.io) {
            global.io.emit("theme-updated", theme);
            console.log("Socket called");
            console.log("Connected Clients:", global.io.engine.clientsCount);
          }

          res.json({
            success: true,
            theme: theme
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.updateThemeSetting = updateThemeSetting;