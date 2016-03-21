'use strict';
 
import fs from 'fs';
import child_process from 'child_process';
import Promise, { coroutine as co } from 'bluebird';
import R from 'ramda';
import { spawn } from 'child_process';

const readFile = Promise.promisify(fs.readFile);
const execProm = Promise.promisify(child_process.exec);
const spawnProm = Promise.promisify(child_process.spawn);

const cmdLine = R.curry((cmd, args) => execProm(`${ cmd } ${ args }`));

// dockerMachine :: string -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
export const exec = cmdLine('docker-machine');

/**
* inspect :: string -> promise(object)
* accepts a machine name and returns the inspect results
*/
export const inspect = (machineName) => exec(`inspect ${ machineName }`);

export const env = co(function *(machineName) {
  let env = yield exec(`env ${ machineName }`);
  env = R.fromPairs(env.split('\n').slice(0, 4).map(val => val.substr(7).split('=')));
  for (var prop in env) {
    var len = env[prop].length - 2;
    env[prop] = env[prop].substr(1).substr(0, len);
  }
  return env;
});

export const ssh = (machineName, args) => exec(`ssh ${ machineName } ${ args }`);

/**
* config :: string -> promise(object)
* accepts a machine name and returns the parsed config results
*/

const createDroplet = (accessToken, dropletName) => {
  dropletName = 'test11';
  accessToken = 'eedf80c21a790ed8328a1f64447a2b239ba98c8137051a362b8bee89530968a7';

  let result = '';
  const createDroplet = spawn('docker-machine', ['create', '--driver', 'digitalocean', '--digitalocean-access-token', accessToken, dropletName]);

  createDroplet.stdout.on('data', data => result += data);

  return new Promise((resolve, reject) => {
    createDroplet.stderr.on('data', reject);
    createDroplet.stdout.on('close', () => {
      resolve(result);
    });
  })
};

// createDroplet('eedf80c21a790ed8328a1f64447a2b239ba98c8137051a362b8bee89530968a7', 'test11');


export const config = co(function *(machineName) {
  const result = JSON.parse(yield inspect(machineName));
  const configObj = {
    uri: `https://${ result.Driver.IPAddress }:2376`,
    cert: (yield readFile(`${ result.HostOptions.AuthOptions.ClientCertPath }`)).toString(),
    key: (yield readFile(`${ result.HostOptions.AuthOptions.ClientKeyPath }`)).toString(),
    ca: (yield readFile(`${ result.HostOptions.AuthOptions.CaCertPath }`)).toString()
  }
  return configObj;
});

//
// // also stops a Droplet on digitalocean
// const stopMachine = machineName => dockerMachine(`stop ${ machineName }`);
//
// // also removes a Droplet on DigitalOcean
// const removeMachine = machineName => dockerMachine(`rm -y ${ machineName }`);
