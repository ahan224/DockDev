'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDockDev = exports.createFolder = undefined;

var _fs = require('fs');

var _path = require('path');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// createFolder :: string -> string -> object
// wraps mkdir in a promise and splits new folder from base path
const createFolder = exports.createFolder = _ramda2.default.curry((folderName, path) => {
  path = (0, _path.join)(path, folderName);
  return new _bluebird2.default((resolve, reject) => {
    (0, _fs.mkdir)(path, err => {
      if (err) return reject(err);
      return resolve(path);
    });
  });
});

// initializes a new DockDev project by adding a .dockdev
const createDockDev = exports.createDockDev = createFolder('.dockdev');