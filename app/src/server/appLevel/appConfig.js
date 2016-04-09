import { join } from 'path';
import Promise, { coroutine as co } from 'bluebird';
import * as utils from '../utils/utils';
import * as machine from '../dockerAPI/machine';
import fs from 'fs';
import rimraf from 'rimraf';
import defaultConfig from '../appLevel/defaultConfig';

const rimrafProm = Promise.promisify(rimraf);

/**
 * checkDockerMachineInstalled() returns true if docker machine is installed or false if not
 * based on checking the version of the docker machine
 *
 * @return {Boolean} returns true or false
 */
const checkDockerMachineInstalled = co(function *g() {
  const result = yield machine.version();
  return result.substr(0, 6) === 'docker';
});

/**
 * checkDockerInstall() returns true if docker is installed or false if not
 * based on running docker in the command line and checking the resulting output
 *
 * @return {Boolean} returns true or false
 */
const checkDockerInstall = co(function *g() {
  const result = yield utils.exec('docker');
  return result.split('\n').length > 1;
});

/**
 * initConfig() returns an object outlining the main config file information
 * based on the passed in DockDev default config object
 *
 * @param {Object} defaultConfig
 * @return {Object} configObj
 */
const initConfig = (input) => ({
  path: input.configPath(),
  projects: [],
  userDir: process.env.HOME,
  DOtoken: '',
});

/**
 * readCongig() returns an object with the main config file information
 * based on the passed in path to the config folder
 *
 * @param {String} configPath
 * @return {Object} configObj
 */
const readConfig = (configPath) =>
  utils.readFile(configPath)
    .then(JSON.parse);

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
const createConfigFolder = (input) =>
  utils.mkdir(join(input.defaultPath, input.configFolder));

/**
 * loadConfigFile() returns the config object from ~/.dockdevconfig or creates/writes it
 * based on passing in the default config object
 *
 * @param {Object} defaultConfig
 * @return {Object} config
 */
export const loadConfigFile = co(function *g(input) {
  try {
    return yield readConfig(input.configPath());
  } catch (e) {
    yield rimrafProm(join(input.defaultPath, input.configFolder));
    yield createConfigFolder(defaultConfig);
    const config = initConfig(defaultConfig);
    yield writeConfig(config);
    return config;
  }
});

/**
 * loadPathsFile() returns a promise that a path will resolve whether or not it is good
 * based on the passed in path
 *
 * @param {String} basePath
 * @return {} promise to resolve 'ERROR' or the projet object
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
 * loadPaths() will load all the paths for every project and if a project fails to load
 * it will run a callback on those failed paths
 *
 * @param {Object} configObj
 * @param {Object} defaultConfig
 * @param {Function} callback
 * @return {}
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

/**
 * addProjToConfig() will add a project's path to the main config file
 * based on the passed in project base path and the default config object
 *
 * @param {String} basePath
 * @param {Object} defaultConfig
 * @return {}
 */
export const addProjToConfig = co(function *g(basePath, defaultConfig) {
  const configPath = defaultConfig.configPath();
  const readConfigFile = yield readConfig(configPath);
  console.log("Am I defined?", readConfigFile);
  readConfigFile.projects.push(basePath);
  yield writeConfig(readConfigFile);
});

/**
 * removeProjFromConfig() will delete a project's path to the main config file
 * based on the passed in project base path and the default config object
 *
 * @param {String} basePath
 * @param {Object} defaultConfig
 * @return {}
 */
export const removeProjFromConfig = co(function *g(projObj, defaultConfig) {
  const configPath = defaultConfig.configPath();
  const readConfigFile = yield readConfig(configPath);
  readConfigFile.projects = readConfigFile.projects.filter(path => path !== projObj.basePath);
  yield utils.writeFile(configPath, utils.jsonStringifyPretty(readConfigFile));
  yield rimrafProm(join(projObj.basePath, defaultConfig.projFolder));
  return true;
});

/**
 * initApp() will run through several processes at app initiation. First,
 * it will check if docker machine is installed, then docker, then check
 * if there is a dockdev machine created yet, then it will redirect to the
 * home page and load all the projects
 * based on the passed in default config object, router, add config and project functions
 *
 * @param {Object} defaultConfig
 * @param {Function} router
 * @param {Function} addConfig
 * @param {Function} addProject
 * @return {Boolean} true
 */
export const initApp = co(function *g(defaultConfig, router, addConfig, addProject) {
  try {
    yield checkDockerMachineInstalled();
  } catch (e) {
    router.replace('/init/1');
    return false;
  }

  try {
    yield checkDockerInstall();
  } catch (e) {
    router.replace('/init/2');
    return false;
  }

  const checkDockDevMachine = yield machine.list();
  if (checkDockDevMachine.indexOf('dockdev') === -1) {
    router.replace('/init/3');
    yield machine.createVirtualBox(defaultConfig.machine);
  }

  router.replace('/');

  const config = yield loadConfigFile(defaultConfig);

  addConfig(config);

  loadPaths(config, defaultConfig, addProject);

  return true;
});
