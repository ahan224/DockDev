// import { exec as childExec } from 'child_process';
import { coroutine as co } from 'bluebird';
import R from 'ramda';
import * as machine from './machine.js';
import { exec } from './utils';

// promisify callback function
// const execProm = Promise.promisify(childExec);

/**
* cleanFilePath() accepts a string file path and returns a string file path with any
* folder names with spaces qouted.
*
* @param {String} basePath
* @return {String} basePath
*/
function cleanFilePath(basePath) {
  const splitPath = basePath.split('/');
  const cleanPath = splitPath.map(val => {
    if (val.indexOf(' ') > -1) return `"${val}"`;
    return val;
  }).join('/');

  return cleanPath;
}

/**
 * rsync() returns a promise that resolves to the stdout
 * based on the passed in string of arguments
 *
 * @param {String} args
 * @return {} returns a promise that resolves to the stdout
 */
const rsync = (args) => exec(`rsync ${args}`);

/**
 * selectWithin() returns a result object
 * it is a helper function to select specified props from a nested object
 * based on the passed in array, key, and object
 *
 * @param {Array} Array
 * @param {String} key
 * @param {Object} obj
 * @return {Object} result
 */
const selectWithin = R.curry((array, key, obj) => {
  const result = {};
  array.forEach(val => { result[val] = obj[key][val]; });
  return result;
});

/**
 * selectSSHandIP() returns a result object
 * it is a composed function that takes in an object, parses it, and passes it
 * to selectWithin
 * Ultimately, it selects ssh and ip address from docker-machine inspect object
 * based on the passed in object when called
 *
 * @param {Object} docker-machine inspect object (passed in below)
 * @return {Object} result (from selectWithin)
 */
const selectSSHandIP = R.compose(
  selectWithin(['SSHKeyPath', 'IPAddress'], 'Driver'),
  JSON.parse
);

/**
 * createRsyncArgs() returns the string of arguments for rsync to run
 * based on the passed in source, destination, and machine information
 *
 * @param {String} source
 * @param {String} dest
 * @param {String} machineInfo
 * @return {String}
 */
const createRsyncArgs = (source, dest, machineInfo) =>
  `-aWOl --inplace --rsh="ssh -i ${machineInfo.SSHKeyPath} -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" --delete ${source} docker@${machineInfo.IPAddress}:${dest}`;

/**
 * getSyncContainer() returns the containerId for the container where sync is turned on
 * based on the passed in project object
 *
 * @param {Object} projObj
 * @return {String} result
 */
function getSyncContainer(projObj) {
  let result;
  for (const container in projObj.containers) {
    if (projObj.containers[container].server) {
      result = projObj.containers[container].containerId;
      break;
    }
  }
  return result;
}

/**
 * generateRsync() returns a promise to run the rsync terminal command
 * initially, it calls a helper function which gathers the arguments for rsync
 * it then runs the rsync terminal command with the given arguments
 * based on the passed in project object
 *
 * @param {Object} projObj
 * @return {} returns a promise to run the rsync terminal command
 */
export function generateRsync(projObj) {
  const getArgs = co(function *g() {
    const machineInfo = selectSSHandIP(yield machine.inspect(projObj.machine));
    const targetContainerId = getSyncContainer(projObj);
    const dest = projObj.containers[targetContainerId].dest;
    const cleanPath = cleanFilePath(projObj.basePath);

    return createRsyncArgs(`${cleanPath}/`, dest, machineInfo);
  });

  const args = getArgs();

  return co(function *g() {
    return yield rsync(yield args);
  });
}

// - File watch
//   - need ability to turnoff projFile watching
//   - handle if the root projFolder name is changed (need new watch)
//   - handle multiple project watches simultaneously
//   - use closure to avoid getting machine inspect 2x (same for volume)
//   - create one watcher and then reference root directory
//
// - Rsync
//   - put the promise that resolves machine ip, ssh, volume location, etc in closure
//   - return a function that requires no parameters, but will rsync after promise resolves
//   - need to consider error handling, but otherwise this solution should work great
//   - should you rsync only the projFile or projFolder that changed or everything
