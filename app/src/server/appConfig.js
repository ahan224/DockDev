import { join } from 'path';
import Promise, { coroutine as co } from 'bluebird';
import * as utils from './utils';
// import defaultConfig from './defaultConfig';
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
const loadPathsFile = (basePath) =>
  new Promise((resolve) => {
    fs.readFile(basePath, (err, result) => {
      if (err) return resolve('ERROR');
      return resolve(result);
    });
  });

/**
 * searchBadPaths() returns an Array of dockdev folder paths, excluding prior good paths
 * based on the passed in array and user directory
 *
 * @param {Array} goodArray
 * @param {String} userDir
 * @return {Array} found paths
 */
const searchBadPaths = co(function *(goodArray, configObj) {
  const searchArray = [];
  if (!ConfigObj.userDir) ConfigObj.userDir = process.env.HOME;
  // create the parameters for the linux find command
  searchArray.push(ConfigObj.userDir);
  searchArray.push('-name');
  searchArray.push(defaultConfig.projFile);

  // create the parameters for files to exclude based on the projects that were already found
  goodArray.forEach((path) => {
    searchArray.push('!');
    searchArray.push('-path');
    searchArray.push(path);
  });

  return yield utils.find(searchArray);
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
export const loadPaths = (configObj, callback) => {
  const goodPaths = [];

  configObj.projects.forEach(path => {
    goodPaths.push(loadPathsFile(path)
      .then(data => {
        if (data !== 'ERROR') callback(data);
      }));
  });

  // Promise.all(goodPaths)
  //   .then(console.log);

  // return Promise.all(goodPaths)
  //   .then(resultsArray => {
  //     if (resultsArray.indexOf('ERROR') !== -1) {
  //       const goodToAvoid = resultsArray.filter(path => path !== 'ERROR');
  //       configObj.projects = goodToAvoid;
  //       searchBadPaths(goodToAvoid, configObj)
  //         .then(badResultsArray => {
  //           badResultsArray.forEach(badPath => {
  //             configObj.projects.push(badPath);
  //             loadPathsFile(badPath)
  //               .then(badPathData => {
  //                 callback(badPathData);
  //               });
  //           });
  //         });
  //     }
  //   })
  //  .catch((err) => console.log(err));
};

//   const searchResultsToUI = [];
//
//   // returns an array of data
//
//   for (let i = 0; i < searchResults.length; i++) {
//     const fileContents = JSON.parse(yield readFile(join(searchResults[i], config.projPath())));
//     searchResultsToUI.push(fileContents);
//   }
//
//   return searchResultsToUI;
// });


//
// export const writeConfig = co(function *(userSelectedDirectory, locationFolder) {
//   if (!userSelectedDirectory) userSelectedDirectory = process.env.HOME;
//   yield mkdir(join(locationFolder, config.configFolder));
//   yield writeFile(config.configPath(locationFolder), JSONStringifyPretty({
//     userSelectedDirectory,
//     projects: {}
//   }));
// });
//
//
// // searches for Good Paths
// export const searchGoodPaths = co(function *(configFile) {
//   const goodPathResults = [];
//
//   for (var key in configFile.projects) {
//     try {
//       const fileContents = JSON.parse(
//         yield readFile(join(configFile.projects[key], config.projPath()))
//       );
//       goodPathResults.push(fileContents);
//     } catch (e) {
//       delete configFile.projects[key];
//     }
//   }
//
//   return goodPathResults;
// });
//
//

//
// // after reading the main configFile, we are going to load all the paths
// export const loadPaths = co(function *(configFile, userSelectedDirectory) {
//   const configProjLength = Object.keys(configFile.projects).length;
//
//   const goodResults = yield searchGoodPaths(configFile);
//
//   let badResults;
// // search for the other projects if there were any errors in the data
//   if (configProjLength !== goodResults.length) {
//     badResults = searchBadPaths(goodResults, userSelectedDirectory);
//   }
//
//  // return an array of arrays with good and bad paths
//   return [goodResults, badResults];
// });
//
// // reads the main configFile at launch of the app, if the file doesn't exist, it writes the file
// export const readConfig = co(function *(userSelectedDirectory) {
//   try {
//     let readConfigFile = yield readFile(config.configPath(process.env.HOME));
//     readConfigFile = JSON.parse(readConfigFile);
//     return yield loadPaths(readConfigFile, userSelectedDirectory);
//   } catch (e) {
//     yield writeConfig(userSelectedDirectory, process.env.HOME);
//     return {};
//   }
// });
//
// // adds projects paths to the main config file
// export const addProjToConfig = co(function *(basePath) {
//   const readConfigFile = yield readConfig(config.configPath(process.env.HOME));
//   readConfigFile.projects[basePath] = basePath;
//   yield writeFile(config.configPath(process.env.HOME), JSONStringifyPretty(readConfigFile));
// });
