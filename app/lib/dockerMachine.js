'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dockerMachine = undefined;

var _fs = require('fs');

var _utils = require('./utils.js');

// dockerMachine :: string -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
var dockerMachine = exports.dockerMachine = (0, _utils.cmdLine)('docker-machine');

// creates a Droplet on DigitalOcean
//** promisify this function
var createDroplet = function createDroplet(accessToken, dropletName) {
  dropletName = "test9";
  accessToken = 'eedf80c21a790ed8328a1f64447a2b239ba98c8137051a362b8bee89530968a7';
  return (0, _fs.spawn)('docker-machine', ['create', '--driver', 'digitalocean', '--digitalocean-access-token', accessToken, dropletName]);
};

// also stops a Droplet on digitalocean
var stopMachine = function stopMachine(machineName) {
  return dockerMachine('stop ' + machineName);
};

// also removes a Droplet on DigitalOcean
var removeMachine = function removeMachine(machineName) {
  return dockerMachine('rm -y ' + machineName);
};