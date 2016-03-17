'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.env = exports.inspect = exports.exec = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = _bluebird2.default.promisify(_fs2.default.readFile);
const execProm = _bluebird2.default.promisify(_child_process2.default.exec);
const cmdLine = _ramda2.default.curry((cmd, args) => execProm(`${ cmd } ${ args }`));

// dockerMachine :: string -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
const exec = exports.exec = cmdLine('docker-machine');

/**
* inspect :: string -> promise(object)
* accepts a machine name and returns the inspect results
*/
const inspect = exports.inspect = machineName => exec(`inspect ${ machineName }`);

const env = exports.env = machineName => exec(`env ${ machineName }`);

/**
* config :: string -> promise(object)
* accepts a machine name and returns the parsed config results
*/
const config = exports.config = (0, _bluebird.coroutine)(function* (machineName) {
  const result = JSON.parse((yield inspect(machineName)));
  const configObj = {
    uri: `https://${ result.Driver.IPAddress }:2376`,
    cert: (yield readFile(`${ result.HostOptions.AuthOptions.ClientCertPath }`)).toString(),
    key: (yield readFile(`${ result.HostOptions.AuthOptions.ClientKeyPath }`)).toString(),
    ca: (yield readFile(`${ result.HostOptions.AuthOptions.CaCertPath }`)).toString()
  };
  return configObj;
});

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