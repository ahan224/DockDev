import { join } from 'path';
import Promise, { coroutine as co } from 'bluebird';
import * as utils from './utils';
import * as machine from './machine.js';
import fs from 'fs';
import { exec as childExec } from 'child_process';

// promisify callback function
const exec = Promise.promisify(childExec);

const checkDockerMachineInstalled = co(function *g() {
  const result = yield machine.version();
  return result.substr(0, 6) === 'docker';
});

const installDockerMachine = () => exec('curl -L https://github.com/docker/machine/releases/download/v0.6.0/docker-machine-`uname -s`-`uname -m` > /usr/local/bin/docker-machine && chmod +x /usr/local/bin/docker-machine')

/**
 * checkDockerInstall() returns true or a promise to install Docker
 * based on checking the default machine and passing in it's environment variables
 *
 * @return {} returns true or a promise to install Docker
 */
const checkDockerInstall = co(function *g() {
  const result = yield exec('docker');
  return result.split('\n').length > 1;
});

const installDocker = () => exec('curl -fsSL https://get.docker.com/ | sh');

/**
 * initCongig() returns an object outlining the main config file information
 * based on the passed in DockDev default config object
 *
 * @param {Object} defaultConfig
 * @return {Object} configObj
 */
const initConfig = (defaultConfig) => ({
  path: defaultConfig.configPath(),
  projects: [],
  userDir: process.env.HOME
});

/**
 * readCongig() returns an object with the main config file information
 * based on the passed in path to the config folder
 *
 * @param {String} configPath
 * @return {Object} configObj
 */
const readConfig = co(function *g(configPath) {
  try {
    return JSON.parse(yield utils.readFile(configPath));
  } catch (e) {
    return undefined;
  }
});

/**
 * writeConfig() return a promise to write the initial config file
 * based on the passed in config object
 *
 * @param {Object} configObj
 * @return {} writes config file
 */
const writeConfig = (configObj) => {
  const strObj = utils.jsonStringifyPretty(configObj);
  return utils.writeFile(configObj.path, strObj);
};

/**
 * createCongigFolder() returns a promise to make the folder for the config file
 * based on the passed in default config object
 *
 * @param {Object} defaultConfig
 * @return {} makes a folder
 */
const createConfigFolder = (defaultConfig) =>
  utils.mkdir(join(defaultConfig.defaultPath, defaultConfig.configFolder));

/**
 * loadConfigFile() returns the config file from ~/.dockdevconfig or creates/writes it
 *
 * @param
 */
export const loadConfigFile = co(function *g(defaultConfig) {
  let config = yield readConfig(defaultConfig.configPath());

  // if config is undefined then config file does not exist
  if (!config) {
    try {
      yield createConfigFolder(defaultConfig);
    } catch (e) {
      console.log(e);
    }
    config = initConfig(defaultConfig);
    yield writeConfig(config);
    return config;
  }

  return config;
});

/**
 * loadPathsFile() returns a promise that a path will reslove whether or not it is good
 * based on the passed in path
 *
 * @param {String} basePath
 * @return {??} promise to resolve the path
 */
const loadPathsFile = (path, defaultConfig) =>
  new Promise((resolve) => {
    fs.readFile(join(path, defaultConfig.projPath()), (err, result) => {
      if (err) return resolve('ERROR');
      const proj = JSON.parse(result.toString());
      proj.basePath = path;
      return resolve(proj);
    });
  });

/**
 * loadPaths() returns a promise that all the paths will resolve and will search for bad
 * paths if any of the good paths fails to load
 * based on the passed in config object with all the paths and an emitter and channel to pass data
 *
 * @param {Object} configObj
 * @param {Emitter} emitter
 * @param {Channel} channel
 * @return {} promise all paths will resolve
 */
export const loadPaths = (configObj, defaultConfig, callback) => {
  const goodPaths = [];

  configObj.projects.forEach(path => {
    goodPaths.push(loadPathsFile(path, defaultConfig)
      .then(data => {
        if (data !== 'ERROR') callback(data);
      }));
  });
};

// adds projects paths to the main config file
export const addProjToConfig = co(function *g(basePath, defaultConfig) {
  const configPath = defaultConfig.configPath();
  const readConfigFile = yield readConfig(configPath);
  readConfigFile.projects.push(basePath);
  yield utils.writeFile(configPath, utils.jsonStringifyPretty(readConfigFile));
});

// load app --> returns config object
export const initApp = co(function *g(defaultConfig, router) {
  const machineInstalled = yield checkDockerMachineInstalled();

  if (!machineInstalled) {
    router.replace('/init/1');
    yield installDockerMachine();
  }

  const dockerInstalled = yield checkDockerInstall();

  if (!dockerInstalled) {
    router.replace('init/2');
    yield installDocker();
  }

  const checkDockDevMachine = yield machine.list();
  if (checkDockDevMachine.indexOf('dockdev') === -1) {
    router.replace('init/3');
    yield machine.createMachine('dockdev');
  }

  router.replace('/');

  return yield loadConfigFile(defaultConfig);
});
