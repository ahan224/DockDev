import { join } from 'path';
import { coroutine as co } from 'bluebird';
import * as utils from '../utils/utils';
import * as appConfig from '../appLevel/appConfig';
import defaultConfig from '../appLevel/defaultConfig';
import errorHandler from '../appLevel/errorHandler';
import {
  FAILED_TO_CREATE_PROJ_DOCKDEV_DIR,
  FAILED_PROJECT_WRITE,
  PROJECT_DIR_USED,
  PROJECT_NAME_EXISTS,
} from '../appLevel/errorMsgs';

/**
 * createProj() returns an object with project-level information, including a uuid
 * based on the passed in basePath and projectName
 *
 * @param {String} basePath
 * @param {String} projectName
 * @return {Object} projObj
 */
export const createProj = (basePath, projectName) => ({
  projectName,
  cleanName: utils.cleanName(projectName),
  basePath,
  containers: [],
  machine: defaultConfig.machine,
  remoteMachine: '',
});

/**
 * createDockDev() returns a promise to create a folder for the project information
 * based on the passed in project object which has the path to create the folder
 *
 * @param {Object} projObj
 * @return {} creates a folder
 */
export const createDockDev = (projObj) =>
  utils.mkdir(join(projObj.basePath, defaultConfig.projFolder))
    .then(() => true)
    .catch(() => {throw FAILED_TO_CREATE_PROJ_DOCKDEV_DIR;});

/**
 * writeProj() returns a promise to write the dockdev.josn file with the project information
 * based on passing in the project object
 *  should be used with readProj for existing projects
 *
 * @param {Object} projObj
 * @return {} writes (or overwrites) the project file (dockdev.json)
 */
export const writeProj = (projObj) =>
  utils.writeFile(
    join(projObj.basePath, defaultConfig.projPath()),
    utils.jsonStringifyPretty(projObj)
  )
    .then(() => true)
    .catch(() => {throw FAILED_PROJECT_WRITE;});


const undoInitProject = co(function *g(projObj) {
  yield appConfig.removeProjFromConfig(projObj, defaultConfig);
  yield utils.rimrafProm(join(projObj.basePath, defaultConfig.projFolder));
  return true;
});

/**
 * initProject() creates the project object, then yields a promise to create the project folder
 * then yields a promise to write the project file, then it adds the project object to memory
 * and it creates the network for the project before finally returning the project object
 * based on initially passing in the basePath, projectName, and overwrite
 *
 * @param {String} basePath
 * @param {String} projectName
 * @param {Boolean} overwrite
 * @return {Object} projObj
 */
export const initProject = co(function *g(basePath, projectName) {
  let projObj;
  try {
    // create initial project object
    projObj = createProj(basePath, projectName);
    // addProjToConfig confirms that the project name & path are unique
    yield appConfig.addProjToConfig(projObj, defaultConfig);
    // create .dockdev folder in selected project folder
    yield createDockDev(projObj);
    // write the project object into the dockdev.json file
    yield writeProj(projObj);
    return projObj;
  } catch (e) {
    // send error to error logging
    errorHandler('initProject', e, [basePath, projectName]);
    // undo any part of the initProject function if unique (dont' remove existing)
    if (e !== PROJECT_DIR_USED && e !== PROJECT_NAME_EXISTS) {
      yield undoInitProject(projObj, defaultConfig);
    }
    throw e;
  }
});
