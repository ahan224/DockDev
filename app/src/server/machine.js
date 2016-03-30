import fs from 'fs';
import { exec as childExec } from 'child_process';
import Promise, { coroutine as co } from 'bluebird';
import R from 'ramda';

// promisify certain callback functions
const readFile = Promise.promisify(fs.readFile);
const execProm = Promise.promisify(childExec);

/**
 * exec() returns a docker-machine terminal command promise that resolves to the stdout
 * based on the passed in string for the 'docker-machine' terminal command
 *
 * @param {String} args
 * @return {} returns a promise that resolves to the stdout
 */
const exec = (args) => execProm(`docker-machine ${args}`);

/**
 * inspect() returns a docker-machine terminal inspect command promise that resolves to the stdout
 * based on the passed in 'MachineName' string
 *
 * @param {String} machineName
 * @return {} returns a promise that resolves to the stdout
 */
export const inspect = (machineName) => exec(`inspect ${machineName}`);

/**
 * status() returns a string indicating if the machine is running
 *
 * @param {String} machineName
 * @return {} returns a promise that resolves to the stdout
 */
export const status = (machineName) => exec(`status ${machineName}`);

/**
 * regenCerts() regenerates the certificates for the machine with force (no stdout output)
 *
 * @param {String} machineName
 * @return {} returns a promise that resolves to the stdout
 */
export const regenCerts = (machineName) => exec(`regenerate-certs -f ${machineName}`);

/**
 * start() starts a docker-machine
 *
 * @param {String} machineName
 * @return {} returns a promise that resolves to the stdout
 */
export const start = (machineName) => exec(`start ${machineName}`);

/**
 * createMachine() returns a new docker-machine without a shared folder
 * based on the passed in arguments string
 *
 * @param {String} machineName
 * @return {} returns a promise that resolves to the stdout
 */
export const createMachine = (machineName) =>
  exec(`create --driver virtualbox --virtualbox-no-share ${machineName}`);

/**
 * env() returns an object with environment variables of a given machine
 * based on the passed in 'MachineName' string
 *
 * @param {String} machineName
 * @return {Object} result
 */
export const env = co(function *g(machineName) {
  let result = yield exec(`env ${machineName}`);
  result = R.fromPairs(result.split('\n').slice(0, 4).map(val => val.substr(7).split('=')));
  for (const prop in result) {
    const len = result[prop].length - 2;
    result[prop] = result[prop].substr(1).substr(0, len);
  }
  return result;
});

/**
 * ssh() returns a docker-machine terminal ssh command to connect a remote machine
 * based on the passed in 'MachineName' string and arguments for the terminal command
 *
 * @param {String} machineName
 * @param {String} args
 * @return {} returns a promise that resolves to the stdout
 */
export const ssh = (machineName, args) => exec(`ssh ${machineName} ${args}`);

/**
 * machineConfig() returns a config object for a given machine with its certificates, uri, and key
 * based on the passed in machine name
 *
 * @param {String} machineName
 * @param {String} containerInfo
 * @return {Object} configObj
 */
export const machineConfig = co(function *(machineName) {
  const result = JSON.parse(yield inspect(machineName));
  const configObj = {
    uri: `https://${result.Driver.IPAddress}:2376`,
    cert: (yield readFile(`${result.HostOptions.AuthOptions.ClientCertPath}`)).toString(),
    key: (yield readFile(`${result.HostOptions.AuthOptions.ClientKeyPath}`)).toString(),
    ca: (yield readFile(`${result.HostOptions.AuthOptions.CaCertPath}`)).toString()
  };
  return configObj;
});

/**
 * version() returns the docker machine version
 *
 * @return {} returns the docker machine version
 */
export const version = () => exec('version');

/**
 * version() returns a list of docker machines
 *
 * @return {} returns a list docker machines
 */
export const list = () => exec('ls');


export const removeMachineFolder = (projObj) =>
  ssh(projObj.machine, `rm -rf /home/docker/dockdev/${projObj.uuid}`);


export const checkMachineRunning = co(function *g(defaultConfig) {
  const running = yield status(defaultConfig.machine);
  if (running.trim() !== 'Running') {
    yield start(defaultConfig.machine);
    // yield regenCerts(defaultConfig.machine);
    return false;
  }
  return true;
});
