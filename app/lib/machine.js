'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.env = exports.inspect = exports.exec = undefined;

var _fs = require('fs');

var _utils = require('./utils.js');

var _bluebird = require('bluebird');

// dockerMachine :: string -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
const exec = exports.exec = (0, _utils.cmdLine)('docker-machine');

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
    cert: (yield (0, _utils.readFile)(`${ result.HostOptions.AuthOptions.ClientCertPath }`)).toString(),
    key: (yield (0, _utils.readFile)(`${ result.HostOptions.AuthOptions.ClientKeyPath }`)).toString(),
    ca: (yield (0, _utils.readFile)(`${ result.HostOptions.AuthOptions.CaCertPath }`)).toString()
  };
  return configObj;
});

// creates a Droplet on DigitalOcean
//** promisify this function
const createDroplet = (accessToken, dropletName) => {
  dropletName = "test9";
  accessToken = 'eedf80c21a790ed8328a1f64447a2b239ba98c8137051a362b8bee89530968a7';
  return (0, _fs.spawn)('docker-machine', ['create', '--driver', 'digitalocean', '--digitalocean-access-token', accessToken, dropletName]);
};

// also stops a Droplet on digitalocean
const stopMachine = machineName => dockerMachine(`stop ${ machineName }`);

// also removes a Droplet on DigitalOcean
const removeMachine = machineName => dockerMachine(`rm -y ${ machineName }`);