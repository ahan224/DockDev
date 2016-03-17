'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// rsync :: string -> promise(string)
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
const rsync = exports.rsync = cmdLine('rsync');

// selectWithin :: [string] -> string -> object
// helper function to select specified props from a nested object
const selectWithin = R.curry((array, key, obj) => {
  const result = {};
  array.forEach(val => result[val] = obj[key][val]);
  return result;
});

// createRsyncArgs :: string -> string -> object -> [string]
// accepts source, destination, and machine info
// returns an array of arguments for rsync
//** this should be redesigned to output just a string
const createRsyncArgs = R.curry((source, dest, machine) => {
  const result = ['-a', '-e'];
  result.push(`"ssh -i ${ machine.SSHKeyPath } -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"`);
  result.push('--delete');
  result.push(source);
  result.push(`docker@${ machine.IPAddress }:${ dest }`);
  return result;
});

// selectSSHandIP :: object -> object
// selects ssh and ip address from docker-machine inspect object
const selectSSHandIP = R.compose(selectWithin(['SSHKeyPath', 'IPAddress'], 'Driver'), JSON.parse);

// generateRsync :: object -> function
// accepts a config object and returns a function that is
// called when files change in the base directory of project
const generateRsync = exports.generateRsync = config => {};

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