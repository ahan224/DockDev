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

const execProm = _bluebird2.default.promisify(_child_process2.default.exec);
const cmdLine = _ramda2.default.curry((cmd, args) => execProm(`${ cmd } ${ args }`));

// rsync :: string -> promise(string)
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
const rsync = exports.rsync = cmdLine('rsync');

// selectWithin :: [string] -> string -> object
// helper function to select specified props from a nested object
const selectWithin = _ramda2.default.curry((array, key, obj) => {
  const result = {};
  array.forEach(val => result[val] = obj[key][val]);
  return result;
});

// createRsyncArgs :: string -> string -> object -> [string]
// accepts source, destination, and machine info
// returns an array of arguments for rsync
const createRsyncArgs = (source, dest, machineInfo) => {

  return `-a -e "ssh -i ${ machineInfo.SSHKeyPath } -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" --delete ${ source } docker@${ machineInfo.IPAddress }:${ dest }`;
};

const source = '/Users/samhagan/dev/codesmith/DockDev/test/userFolder/project5';
const dest = '/opt/test';
const sandbox = {
  SSHKeyPath: '/Users/samhagan/.docker/machine/machines/sandbox/id_rsa',
  IPAddress: '192.168.99.102'
};

rsync(createRsyncArgs(source, dest, sandbox)).then(console.log).catch(console.log);

// selectSSHandIP :: object -> object
// selects ssh and ip address from docker-machine inspect object
const selectSSHandIP = _ramda2.default.compose(selectWithin(['SSHKeyPath', 'IPAddress'], 'Driver'), JSON.parse);

function getSyncContainer(projObj) {
  for (var container in projObj.containers) {
    if (projObj.containers[container].sync) return projObj.containers[container].containerId;
  }
}

// generateRsync :: object -> function
// accepts a config object and returns a function that is
// called when files change in the base directory of project
function generateRsync(projObj) {

  const getArgs = (0, _bluebird.coroutine)(function* () {
    const machineInfo = selectSSHandIP((yield machine.inspect(projObj.machine)));
    const targetContainerId = getSyncContainer(projObj);
    const dest = projObj.containers[targetContainerId].dest;

    try {
      yield machine.ssh(projObj.machine, `mkdir ${ dest }`);
    } catch (e) {
      // console.log(e);
    }

    return createRsyncArgs(`${ projObj.basePath }/`, dest, machineInfo);
  });

  const args = getArgs();

  return (0, _bluebird.coroutine)(function* () {
    return yield rsync((yield args));
  });
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