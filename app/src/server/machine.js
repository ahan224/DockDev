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

// TODO this function is supposed to create a machine without a shared folder, but we are unable to find that option at the moment
/**
 * create() returns a new docker-machine without a shared folder
 * based on the passed in arguments string
 *
 * @param {String} machineName
 * @return {} returns a promise that resolves to the stdout
 */
export const create = (machineName) => exec(`create --driver virtualbox ${machineName}`);

/**
 * env() returns an object with environment variables of a given machine
 * based on the passed in 'MachineName' string
 *
 * @param {String} machineName
 * @return {Object} result
 */
export const env = co(function *(machineName) {
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
 * config() returns a config object for a given machine with its certificates, uri, and key
 * based on the passed in machine name
 *
 * @param {String} machineName
 * @param {String} containerInfo
 * @return {Object} configObj
 */
export const config = co(function *(machineName) {
  const result = JSON.parse(yield inspect(machineName));
  const configObj = {
    uri: `https://${result.Driver.IPAddress}:2376`,
    cert: (yield readFile(`${result.HostOptions.AuthOptions.ClientCertPath}`)).toString(),
    key: (yield readFile(`${result.HostOptions.AuthOptions.ClientKeyPath}`)).toString(),
    ca: (yield readFile(`${result.HostOptions.AuthOptions.CaCertPath}`)).toString()
  };
  return configObj;
});

//
// // also stops a Droplet on digitalocean
// const stopMachine = machineName => dockerMachine(`stop ${ machineName }`);
//
// // also removes a Droplet on DigitalOcean
// const removeMachine = machineName => dockerMachine(`rm -y ${ machineName }`);
