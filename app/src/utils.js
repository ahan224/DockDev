import { mkdir, writeFile, readFile } from 'fs';
import { join } from 'path';
import Promise from 'bluebird';
import R from 'ramda';
import uuid from 'node-uuid';
import exec from 'child_process';

// config file names
const configFolder = '.dockdev';
const configFile = 'dockdev.json';


// createFolder :: string -> string -> object
// wraps mkdir in a promise and splits new folder from base path
const createFolder = R.curry((folderName, path) => {
  path = join(path, folderName);
  return new Promise((resolve, reject) => {
    mkdir(path, err => {
      if (err) return reject(err);
      return resolve(path);
    });
  });
});

// createDockDev :: string -> string -> object
// initializes a new DockDev project by adding a .dockdev
export const createDockDev = createFolder(configFolder);

// writeJSON :: string -> object -> string -> object
// wraps writeFile in a promise, accepts an object and stringifies it
const writeJSON = R.curry((fileName, obj, path) => {
  path = join(path, fileName);
  return new Promise((resolve, reject) => {
    writeFile(path, JSON.stringify(obj, null, 2), err => {
      if (err) return reject(err);
      return resolve(path);
    });
  });
});

// writeConfig :: object -> string -> object
// writes the config object to the specified path
// it will overwrite any existing file.
// should be used with readConfig for existing projects
export const writeConfig = writeJSON(configFile);

// readJSON :: string -> string -> object
// wraps readFile in a promise and splits filename from base path
const readJSON = R.curry((fileName, path) => {
  path = join(path, fileName);
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (err, data) => {
      if (err) return reject(err);
      return resolve(JSON.parse(data));
    });
  });
})

// readConfig :: string -> object
// given a base path it will return the parsed JSON file
export const readConfig = readJSON(configFile);

// createConfig :: string -> object
// accepts a project name and returns an object with uuid and projectName properties
export const createConfig = projectName => ({
  uuid: uuid.v4(),
  projectName
})

// cmdLine :: string -> [string] -> object
// returns the stdout of the command line call within a promise
const cmdLine = R.curry((cmd, args) => {
  args = `${ cmd } ${ args.join(' ') }`;
  return new Promise((resolve, reject) => {
    exec(args, (err, stdout) => {
      if (err) reject(err);
      resolve(stdout);
    });
  })
});

// dockerMachine :: [string] -> object
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
export const dockerMachine = cmdLine('docker-machine');

// rsync :: [string] -> object
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
export const rsync = cmdLine('rsync');

// selectWithin :: [string] -> string -> object
// helper function to select specified props from a nested object
const selectWithin = R.curry((array, key, obj) => {
  const result = {};
  array.forEach(val => result[val] = obj[key][val]);
  return result;
})

// createRsyncArgs :: string -> string -> object -> [string]
// accepts source, destination, and machine info
// returns an array of arguments for rsync
const createRsyncArgs = R.curry((source, dest, machine) => {
  const result = ['-a', '-e'];
  result.push(`"ssh -i ${ machine.SSHKeyPath } -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"`);
  result.push('--delete');
  result.push(source);
  result.push(`docker@${ machine.IPAddress }:${ dest }`)
  return result;
});

// selectSSHandIP :: object -> object
// selects ssh and ip address from docker-machine inspect object
const selectSSHandIP = R.compose(
  selectWithin(['SSHKeyPath', 'IPAddress'], 'Driver'),
  JSON.parse
);

// const runRsync = (source, dest, machineName) => {
//   dockerMachine(['inspect', machineName])
//   .then(selectSSHandIP)
//   .then(createRsyncArgs(source, dest))
//   .then(rsync)
//   .catch(console.log)
// }


// generateRsync :: object -> function
// accepts a config object and returns a function that is
// called when files change in the base directory of project
export const generateRsync = config => {


}
