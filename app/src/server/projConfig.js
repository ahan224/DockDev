import { join } from 'path';
import { coroutine as co } from 'bluebird';
import R from 'ramda';
import uuid from 'node-uuid';
import * as utils from './utils';
import defaultConfig from './defaultConfig';

/**
* @param {Object} memory object to store all projects
*/
export const memory = {};

/**
 * createProj() returns an object with project-level information, including a uuid
 * based on the passed in basePath and projectName
 *
 * @param {String} basePath
 * @param {String} projectName
 * @return {Object} projObj
 */
export const createProj = (basePath, projectName) => ({
  uuid: uuid.v4(),
  projectName,
  basePath,
  containers: {},
  machine: 'default'
});

/**
 * createDockDev() returns a promise to create a folder for the project information
 * based on the passed in project object which has the path to create the folder
 *
 * @param {Object} projObj
 * @return {} creates a folder
 */
export const createDockDev = (projObj) =>
  utils.mkdir(join(projObj.basePath, defaultConfig.projFolder));

/**
 * cleanProjToWrite() returns a formatted object with information to be stored in the project file
 * based on composing R.pick (which parameters to write) and indent formatting (jsonStringifyPretty)
 *
 * @param {Object} projObj
 * @return {Object} 'clean' projObj
 */
const cleanProjToWrite = R.compose(
  utils.jsonStringifyPretty,
  R.pick(defaultConfig.projWriteParams)
);

/**
 * writeProj() returns a promise to write the dockdev.josn file with the project information
 * based on passing in the project object
 *  should be used with readProj for existing projects
 *
 * @param {Object} projObj
 * @return {} writes (or overwrites) the project file (dockdev.json)
 */
export const writeProj = (projObj) =>
  utils.writeFile(join(projObj.basePath, defaultConfig.projPath()), cleanProjToWrite(projObj));

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
 * addProjToMemory() will place the project object in memory and returns the project object
 * based on initially passing in the memory object and then later the project object
 *
 * @param {Object} memory
 * @param {Object} projObj
 * @return {Object} projObj
 */
export const addProjToMemory = R.curry((memObj, projObj) => {
  memObj[projObj.uuid] = projObj;
  return projObj;
});

// curried version of the addProjToMemory function (see above)
export const addToAppMemory = addProjToMemory(memory);

// initProject :: string -> string -> promise(object)
// combines the sequence of functions to initiate a new projects
// takes a path and a project name and returns the defaultConfig object

/**
 * initProject() creates the project object, then yields a promise to create the project folder
 * then yields a promise to write the project file, then it adds the project object to memory
 * and finally, it returns the project object
 * based on initially passing in the basePath and projectName
 *
 * @param {String} basePath
 * @param {String} projectName
 * @return {Object} projObj
 */
export const initProject = co(function *(basePath, projectName) {

  const projObj = createProj(basePath, projectName);

  yield createDockDev(projObj);
  yield writeProj(projObj);

  // TODO: need to work on this part and uncomment this part here
  // addProjToConfig(basePath);
  addToAppMemory(projObj);

  return projObj;
});

// initProject(process.env.HOME, 'testProject');
