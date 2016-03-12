import { mkdir, writeFile, readFile } from 'fs';
import { join } from 'path';
import Promise from 'bluebird';
import R from 'ramda';
import uuid from 'node-uuid';
import exec from 'child_process';

// config variables
const configFolder = '.dockdev';
const configFile = 'dockdev.json';

// object to store all projects
export const memory = {};

// list of the parameters from the configObj that should be
// written to dockdev.json.  Remaining parameters are in-memory only.
// this needs to be updated for properties that should be stored on disk
export const configWriteParams = ['uuid', 'projectName']

// JSONStringifyPretty :: a -> string
// predefines JSON stringify with formatting
const JSONStringifyPretty = (obj) => JSON.stringify(obj, null, 2);

// createConfig :: string -> string -> object
// accepts a project name & basePath, returns object with uuid
export const createConfig = (basePath, projectName) => ({
  uuid: uuid.v4(),
  projectName,
  basePath
});

// createFolder :: string -> object -> promise(object)
// wraps mkdir in a promise and splits new folder from base path
const createFolder = R.curry((folderName, configObj) => {
  const path = join(configObj.basePath, folderName);
  return new Promise((resolve, reject) => {
    mkdir(path, err => {
      if (err) return reject(err);
      return resolve(configObj);
    });
  });
});

// createDockDev :: object -> promise(object)
// initializes a new DockDev project by adding a .dockdev
export const createDockDev = createFolder(configFolder);

// writeFileProm :: string -> function -> object -> promise(object)
// wraps writeFile in a promise, accepts an object and a transformation
const writeFileProm = R.curry((fileName, transform, configObj) => {
  const path = join(configObj.basePath, fileName);
  return new Promise((resolve, reject) => {
    writeFile(path, transform(configObj), err => {
      if (err) return reject(err);
      return resolve(configObj);
    });
  });
});

// cleanConfigToWrite :: object -> string
// removes in-memory properties to write config to dockdev.json
// also JSON stringifies with indent formatting
const cleanConfigToWrite = R.compose(
  JSONStringifyPretty,
  R.pick(configWriteParams)
)

// writeConfig :: string -> function -> object -> promise(object)
// writes the config object to the specified path
// it will overwrite any existing file.
// should be used with readConfig for existing projects
export const writeConfig = writeFileProm(join(configFolder, configFile), cleanConfigToWrite);

// readJSON :: string -> string -> promise(object)
// wraps readFile in a promise and splits filename from base path
// returns the config object with the basePath added
// transform is a function that takes the JSON string and basePath
// other transform functions can be created if they follow that structure
const readJSON = R.curry((fileName, transform, basePath) => {
  const path = join(basePath, fileName);
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (err, data) => {
      if (err) return reject(err);
      return resolve(transform(data, basePath));
    });
  });
})

// addBasePath :: string -> string -> object
// takes a json string, parses it, and returns a new object with the basePath included
const addBasePath = (jsonObj, basePath) => R.merge(JSON.parse(jsonObj), { basePath });

// readConfig :: string -> promise(object)
// given a base path it will return the parsed JSON file
export const readConfig = readJSON(join(configFolder, configFile), addBasePath);

// extendConfig :: object -> object
// accepts the existing config as first paramater
// and merges/overwrites with the second object
const extendConfig = R.merge;

// addConfigToMemory :: object -> object -> object
// adds the configObj for the project to the memory object
export const addConfigToMemory = R.curry((memory, configObj) => {
  memory[configObj.uuid] = configObj;
  return configObj
})

export const addToAppMemory = addConfigToMemory(memory);

// initiateProject :: string -> string -> promise(object)
// combines the sequence of functions to initiate a new projects
// takes a path and a project name and returns the config object
export const initiateProject = (basePath, projectName) => {
  const configObj = createConfig(basePath, projectName);

  return createDockDev(configObj)
    .then(writeConfig)
    .then(addToAppMemory)
}

// cmdLine :: string -> [string] -> promise(string)
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

// dockerMachine :: [string] -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
export const dockerMachine = cmdLine('docker-machine');

// rsync :: [string] -> promise(string)
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
export const rsync = cmdLine('rsync');

// docker :: [string] -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
export const docker = cmdLine('docker');



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
