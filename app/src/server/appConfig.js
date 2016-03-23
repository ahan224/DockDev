import { join } from 'path';
import Promise, { coroutine as co } from 'bluebird';
import * as utils from './utils';
import * as machine from './machine.js';
import fs from 'fs';
import { exec as childExec } from 'child_process';

// promisify callback function
const exec = Promise.promisify(childExec);

/**
 * checkDockerInstall() returns true or a promise to install Docker
 * based on checking the default machine and passing in it's environment variables
 *
 * @return {} returns true or a promise to install Docker
 */
export const checkDockerInstall = co(function *g() {
  const env = yield machine.env('default');
  const result = yield exec('docker info', { env });
  if (!result) return yield exec('curl -fsSL https://get.docker.com/ | sh');
  return true;
});

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
const loadPathsFile = path =>
  new Promise((resolve) => {
    fs.readFile(path, (err, result) => {
      if (err) return resolve('ERROR');
      return resolve(result);
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
    goodPaths.push(loadPathsFile(join(path, defaultConfig.projPath()))
      .then(data => {
        if (data !== 'ERROR') callback(JSON.parse(data.toString()));
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
