import { join } from 'path';
import { coroutine as co } from 'bluebird';
import * as utils from '../utils/utils';
import * as machine from '../dockerAPI/machine';
import {
  FAILED_READ_CONFIG,
  FAILED_TO_WRITE_CONFIG,
  PROJECT_NAME_EXISTS,
  PROJECT_DIR_USED,
  FAILED_TO_READ_PROJECT,
  EEXIST,
  FAILED_TO_CREATE_CONFIG_DIR,
} from './errorMsgs';

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
const initConfig = (defaultConfig) => ({
  path: defaultConfig.configPath(),
  projects: [],
  userDir: process.env.HOME,
  DOToken: '',
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
    .then(JSON.parse)
    .catch(() => {throw FAILED_READ_CONFIG;});

/**
 * writeConfig() return a promise to write the initial config file
 * based on the passed in config object
 *
 * @param {Object} configObj
 * @return {} writes config file
 */
const writeConfig = (configObj) => {
  const strObj = utils.jsonStringifyPretty(configObj);
  return utils.writeFile(configObj.path, strObj)
    .catch(() => {throw FAILED_TO_WRITE_CONFIG; });
};

/**
 * createCongigFolder() returns a promise to make the folder for the config file
 * based on the passed in default config object
 *
 * @param {Object} defaultConfig
 * @return {} makes a folder
 */
const createConfigFolder = (defaultConfig) =>
  utils.mkdir(join(defaultConfig.defaultPath, defaultConfig.configFolder))
    .then(() => true)
    .catch(err => {
      if (err.code !== EEXIST) throw FAILED_TO_CREATE_CONFIG_DIR;
      return false;
    });

/**
 * loadConfigFile() returns the config object from ~/.dockdevconfig or creates/writes it
 * based on passing in the default config object
 *
 * @param {Object} defaultConfig
 * @return {Object} config
 */
export const loadConfigFile = co(function *g(defaultConfig) {
  try {
    if (yield createConfigFolder(defaultConfig)) {
      const config = initConfig(defaultConfig);
      yield writeConfig(config);
      return config;
    }
    return yield readConfig(defaultConfig.configPath());
  } catch (e) {
    throw e; // potentially need to additional handling here
  }
});

/**
 * removeBadProject() removes a failed load project from the app config file
 *
 * @param {String} path
 * @param {Object} defaultConfig
 * @return {Promise}
 */
export const removeBadProject = co(function *g(path, defaultConfig) {
  const configPath = defaultConfig.configPath();
  const readConfigFile = yield readConfig(configPath);
  readConfigFile.projects =
   readConfigFile.projects.filter(obj => obj.basePath !== path);
  yield writeConfig(readConfigFile);
  return true;
});

/**
 * loadProject() will read the project configuration from the specified path
 *
 * @param {String} path
 * @param {Object} defaultConfig
 * @return {Promise}
 */
export const loadProject = (path, defaultConfig) =>
  utils.readFile(join(path, defaultConfig.projPath()))
    .then(JSON.parse)
    .catch(() => {
      removeBadProject(path, defaultConfig); // the sequence here may need to be reconsidered
      throw FAILED_TO_READ_PROJECT;
    });

/**
 * checkUniqueName() returns true if the selected project name exists
 *
 * @param {String} projectName
 * @param {Array} projArray
 * @return {Boolean}
 */
const checkUniqueName = (projectName, projArray) => {
  for (let i = 0; i < projArray.length; i++) {
    if (projArray[i].projectName === projectName) return true;
  }
  return false;
};

/**
 * checkNewPath() returns true if the selected path is already a project
 *
 * @param {String} basePath
 * @param {Array} projArray
 * @return {Boolean}
 */
const checkNewPath = (basePath, projArray) => {
  for (let i = 0; i < projArray.length; i++) {
    if (projArray[i].basePath === basePath) return true;
  }
  return false;
};

/**
 * addProjToConfig() will add a project's path to the main config file
 * based on the passed in project base path and the default config object
 *
 * @param {String} basePath
 * @param {Object} defaultConfig
 * @return {}
 */
export const addProjToConfig = co(function *g(projObj, defaultConfig) {
  const configPath = defaultConfig.configPath();
  const readConfigFile = yield readConfig(configPath);
  if (checkUniqueName(projObj.cleanName, readConfigFile.projects)) throw PROJECT_NAME_EXISTS;
  if (checkNewPath(projObj.basePath, readConfigFile.projects)) throw PROJECT_DIR_USED;
  readConfigFile.projects.push({
    basePath: projObj.basePath,
    projectName: projObj.projectName,
    cleanName: projObj.cleanName,
  });
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
  readConfigFile.projects =
    readConfigFile.projects.filter(obj => obj.basePath !== projObj.basePath);
  yield writeConfig(readConfigFile);
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
