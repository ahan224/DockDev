import { join } from 'path';
import Promise, { coroutine as co } from 'bluebird';
import * as utils from './utils';
import defaultConfig from './defaultConfig';

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
 * @param {path} configPath
 * @return {Object} configObj
 */
const readConfig = co(function *(configPath) {
  try {
    return JSON.parse(yield utils.readFile(configPath));
  } catch (e) {
    return undefined;
  }
});

/**
 * writeCongig() return a promise to write the initial config file
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
 * loadPaths() returns
 * based on the passed in
 *
 * @param {Object}
 * @return {}
 */
const loadPaths = (configObj, emitter, channel) => {
  const goodPaths = [];

  configObj.projects.forEach(path => {
    utils.readFile(path)
      .then(data => emitter.send(channel, data))
      .catch()
  })

  //emitter.send(channel,)
}




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
// // search Bad Paths
// export const searchBadPaths = co(function *(goodPathsArray, userSelectedDirectory) {
//   const searchArray = [];
//   if (!userSelectedDirectory) userSelectedDirectory = process.env.HOME;
//   // create the parameters for the linux find command
//   searchArray.push(userSelectedDirectory);
//   searchArray.push('-name');
//   searchArray.push(config.projFile);
//
//   // create the parameters for files to exclude based on the projects that were already found
//   goodPathsArray.forEach((path) => {
//     searchArray.push('!');
//     searchArray.push('-path');
//     searchArray.push(path);
//   });
//
//   const searchResultsToUI = [];
//
//   // returns an array of data
//   const searchResults = yield findDockdev(searchArray);
//   for (let i = 0; i < searchResults.length; i++) {
//     const fileContents = JSON.parse(yield readFile(join(searchResults[i], config.projPath())));
//     searchResultsToUI.push(fileContents);
//   }
//
//   return searchResultsToUI;
// });
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
