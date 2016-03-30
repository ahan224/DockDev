
//
// // also stops a Droplet on digitalocean
// const stopMachine = machineName => dockerMachine(`stop ${ machineName }`);
//
// // also removes a Droplet on DigitalOcean
// const removeMachine = machineName => dockerMachine(`rm -y ${ machineName }`);

/**
 * manageProject() will perform an action on the project containers
 * functions that we will pass into the callback include:
 * start, stop, restart, and remove (see above)
 * based on initially passing in the project object and the callback
 *
 * @param {Object} projObj
 * @param {Function} containerFn
 * @return {} will perform an action on the project containers
 */
export const manageProject = co(function *(projObj, containerFn) {
  for (var key in projObj.containers) {
    containerFn(projObj.machine, key);
  }
});

/**
 * checkDockerInstall() returns true or a promise to install Docker
 * based on checking the default machine and passing in it's environment variables
 *
 * @return {} returns true or a promise to install Docker
 */
const installDockerMachine = () => exec('curl -L https://github.com/docker/machine/releases/download/v0.6.0/docker-machine-`uname -s`-`uname -m` > /usr/local/bin/docker-machine && chmod +x /usr/local/bin/docker-machine')

/**
 * addBasePath() returns a new object with the basePath included
 * based on passing a json string and parsing it
 *
 * @param {String} jsonObj
 * @param {String} basePath
 * @return {Object} projObj
 */
const addBasePath = (jsonObj, basePath) => R.merge(JSON.parse(jsonObj), { basePath });

/**
 * readProj() yields a promise which, upon completion returns a proj object with a basePath included
 * based on passing in a basePath for reading and then parsing the file
 *
 * @param {String} basePath
 * @return {Object} projObj
 */
export const readProj = co(function *(basePath) {
  const readProjFile = yield utils.readFile(join(basePath, defaultConfig.projPath()));
  return addBasePath(readProjFile, basePath);
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
export const loadPaths = (configObj, defaultConfig, callback) => {
  const goodPaths = [];

  configObj.projects.forEach(path => {
    goodPaths.push(loadPathsFile(join(path, defaultConfig.projPath()))
      .then(data => {
        if (data !== 'ERROR') callback(JSON.parse(data.toString()));
      }));
  });

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
  //     } else {
  //       return configObj;
  //     }
  //   })
  //  .catch((err) => console.log(err));
};

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
