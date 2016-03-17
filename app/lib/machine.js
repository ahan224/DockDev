'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.ssh = exports.env = exports.inspect = exports.exec = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFile = _bluebird2.default.promisify(_fs2.default.readFile);
var execProm = _bluebird2.default.promisify(_child_process2.default.exec);
var cmdLine = _ramda2.default.curry(function (cmd, args) {
  return execProm(cmd + ' ' + args);
});

// dockerMachine :: string -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
var exec = exports.exec = cmdLine('docker-machine');

/**
* inspect :: string -> promise(object)
* accepts a machine name and returns the inspect results
*/
var inspect = exports.inspect = function inspect(machineName) {
  return exec('inspect ' + machineName);
};

var env = exports.env = function env(machineName) {
  return exec('env ' + machineName);
};

var ssh = exports.ssh = function ssh(machineName, args) {
  return exec('ssh ' + machineName + ' ' + args);
};

/**
* config :: string -> promise(object)
* accepts a machine name and returns the parsed config results
*/
var config = exports.config = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(machineName) {
  var result, configObj;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = JSON;
          _context.next = 3;
          return inspect(machineName);

        case 3:
          _context.t1 = _context.sent;
          result = _context.t0.parse.call(_context.t0, _context.t1);
          _context.t2 = 'https://' + result.Driver.IPAddress + ':2376';
          _context.next = 8;
          return readFile('' + result.HostOptions.AuthOptions.ClientCertPath);

        case 8:
          _context.t3 = _context.sent.toString();
          _context.next = 11;
          return readFile('' + result.HostOptions.AuthOptions.ClientKeyPath);

        case 11:
          _context.t4 = _context.sent.toString();
          _context.next = 14;
          return readFile('' + result.HostOptions.AuthOptions.CaCertPath);

        case 14:
          _context.t5 = _context.sent.toString();
          configObj = {
            uri: _context.t2,
            cert: _context.t3,
            key: _context.t4,
            ca: _context.t5
          };
          return _context.abrupt('return', configObj);

        case 17:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}));

// creates a Droplet on DigitalOcean
//** promisify this function
// const createDroplet = (accessToken, dropletName) => {
//  dropletName = "test9";
//  accessToken = 'eedf80c21a790ed8328a1f64447a2b239ba98c8137051a362b8bee89530968a7';
//  return spawn('docker-machine', ['create', '--driver', 'digitalocean', '--digitalocean-access-token', accessToken, dropletName]);
// }
//
// // also stops a Droplet on digitalocean
// const stopMachine = machineName => dockerMachine(`stop ${ machineName }`);
//
// // also removes a Droplet on DigitalOcean
// const removeMachine = machineName => dockerMachine(`rm -y ${ machineName }`);