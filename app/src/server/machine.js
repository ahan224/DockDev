import fs from 'fs';
import { exec as childExec, spawn } from 'child_process';
import Promise, { coroutine as co } from 'bluebird';
import R from 'ramda';

const readFile = Promise.promisify(fs.readFile);
const execProm = Promise.promisify(childExec);

// dockerMachine :: string -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
const exec = (args) => execProm(`docker-machine ${args}`);

/**
* inspect :: string -> promise(object)
* accepts a machine name and returns the inspect results
*/
export const inspect = (machineName) => exec(`inspect ${machineName}`);

export const env = co(function *(machineName) {
  let result = yield exec(`env ${machineName}`);
  result = R.fromPairs(env.split('\n').slice(0, 4).map(val => val.substr(7).split('=')));
  for (const prop in result) {
    const len = result[prop].length - 2;
    result[prop] = result[prop].substr(1).substr(0, len);
  }
  return result;
});

export const ssh = (machineName, args) => exec(`ssh ${machineName} ${args}`);

/**
* config :: string -> promise(object)
* accepts a machine name and returns the parsed config results
*/

const dropletOnOcean = (accessToken, dropletName) => {
  let result = '';
  const createDroplet = spawn('docker-machine',
    ['create', '--driver', 'digitalocean',
    '--digitalocean-access-token', accessToken, dropletName]);

  createDroplet.stdout.on('data', data => { result += data; });

  return new Promise((resolve, reject) => {
    createDroplet.stderr.on('data', reject);
    createDroplet.stdout.on('close', () => {
      resolve(result);
    });
  });
};

// createDroplet('eedf80c21a790ed8328a1f64447a2b239ba98c8137051a362b8bee89530968a7', 'test11');


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
