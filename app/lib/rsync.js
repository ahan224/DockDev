'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rsync = undefined;
exports.generateRsync = generateRsync;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _machine = require('./machine.js');

var machine = _interopRequireWildcard(_machine);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var execProm = _bluebird2.default.promisify(_child_process2.default.exec);
var cmdLine = _ramda2.default.curry(function (cmd, args) {
  return execProm(cmd + ' ' + args);
});

// rsync :: string -> promise(string)
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
var rsync = exports.rsync = cmdLine('rsync');

// selectWithin :: [string] -> string -> object
// helper function to select specified props from a nested object
var selectWithin = _ramda2.default.curry(function (array, key, obj) {
  var result = {};
  array.forEach(function (val) {
    return result[val] = obj[key][val];
  });
  return result;
});

// createRsyncArgs :: string -> string -> object -> [string]
// accepts source, destination, and machine info
// returns an array of arguments for rsync
var createRsyncArgs = function createRsyncArgs(source, dest, machineInfo) {

  return '-a -e "ssh -i ' + machineInfo.SSHKeyPath + ' -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" --delete ' + source + ' docker@' + machineInfo.IPAddress + ':' + dest;
};

var source = '/Users/samhagan/dev/codesmith/DockDev/test/userFolder/project5';
var dest = '/opt/test';
var sandbox = {
  SSHKeyPath: '/Users/samhagan/.docker/machine/machines/sandbox/id_rsa',
  IPAddress: '192.168.99.102'
};

rsync(createRsyncArgs(source, dest, sandbox)).then(console.log).catch(console.log);

// selectSSHandIP :: object -> object
// selects ssh and ip address from docker-machine inspect object
var selectSSHandIP = _ramda2.default.compose(selectWithin(['SSHKeyPath', 'IPAddress'], 'Driver'), JSON.parse);

function getSyncContainer(projObj) {
  for (var container in projObj.containers) {
    if (projObj.containers[container].sync) return projObj.containers[container].containerId;
  }
}

// generateRsync :: object -> function
// accepts a config object and returns a function that is
// called when files change in the base directory of project
function generateRsync(projObj) {

  var getArgs = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
    var machineInfo, targetContainerId, dest;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return machine.inspect(projObj.machine);

          case 2:
            _context.t0 = _context.sent;
            machineInfo = selectSSHandIP(_context.t0);
            targetContainerId = getSyncContainer(projObj);
            dest = projObj.containers[targetContainerId].dest;
            _context.prev = 6;
            _context.next = 9;
            return machine.ssh(projObj.machine, 'mkdir ' + dest);

          case 9:
            _context.next = 13;
            break;

          case 11:
            _context.prev = 11;
            _context.t1 = _context['catch'](6);

          case 13:
            return _context.abrupt('return', createRsyncArgs(projObj.basePath + '/', dest, machineInfo));

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[6, 11]]);
  }));

  var args = getArgs();

  return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return args;

          case 2:
            _context2.t0 = _context2.sent;
            _context2.next = 5;
            return rsync(_context2.t0);

          case 5:
            return _context2.abrupt('return', _context2.sent);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
}

// - File watch
//   - need ability to turnoff projFile watching
//   - handle if the root projFolder name is changed (need new watch)
//   - handle multiple project watches simultaneously
//   - use closure to avoid getting machine inspect 2x (same for volume)
//   - create one watcher and then reference root directory
//
// - Rsync
//   - put the promise that resolves machine ip, ssh, volume location, etc in closure
//   - return a function that requires no parameters, but will rsync after promise resolves
//   - need to consider error handling, but otherwise this solution should work great
//   - should you rsync only the projFile or projFolder that changed or everything