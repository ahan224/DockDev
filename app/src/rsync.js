import child_process from 'child_process';
import Promise, { coroutine as co } from 'bluebird';
import R from 'ramda';
import * as machine from './machine.js';

const execProm = Promise.promisify(child_process.exec);
const cmdLine = R.curry((cmd, args) => execProm(`${ cmd } ${ args }`));

// rsync :: string -> promise(string)
// accepts an array of cmd line args for rsync
// returns a promise that resolves to teh stdout
export const rsync = cmdLine('rsync');

// selectWithin :: [string] -> string -> object
// helper function to select specified props from a nested object
const selectWithin = R.curry((array, key, obj) => {
  const result = {};
  array.forEach(val => result[val] = obj[key][val]);
  return result;
})

// createRsyncArgs :: string -> string -> object -> [string]
// accepts source, destination, and machine info
// returns an array of arguments for rsync
const createRsyncArgs = (source, dest, machineInfo) => {

  return `-a -e "ssh -i ${ machineInfo.SSHKeyPath } -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" --delete ${ source } docker@${ machineInfo.IPAddress }:${ dest }`

};


const source = '/Users/samhagan/dev/codesmith/DockDev/test/userFolder/project5';
const dest = '/opt/test';
const sandbox = {
  SSHKeyPath: '/Users/samhagan/.docker/machine/machines/sandbox/id_rsa',
  IPAddress: '192.168.99.102'
}

rsync(createRsyncArgs(source, dest, sandbox))
  .then(console.log)
  .catch(console.log);


// selectSSHandIP :: object -> object
// selects ssh and ip address from docker-machine inspect object
const selectSSHandIP = R.compose(
  selectWithin(['SSHKeyPath', 'IPAddress'], 'Driver'),
  JSON.parse
);

function getSyncContainer(projObj) {
  for (var container in projObj.containers) {
    if (projObj.containers[container].sync) return projObj.containers[container].containerId;
  }
}


// generateRsync :: object -> function
// accepts a config object and returns a function that is
// called when files change in the base directory of project
export function generateRsync(projObj) {

  const getArgs = co(function *() {
    const machineInfo = selectSSHandIP(yield machine.inspect(projObj.machine));
    const targetContainerId = getSyncContainer(projObj);
    const dest = projObj.containers[targetContainerId].dest;

    try {
      yield machine.ssh(projObj.machine, `mkdir ${ dest }`)
    } catch (e) {
      // console.log(e);
    }

    return createRsyncArgs(`${ projObj.basePath }/`, dest, machineInfo);
  })

  const args = getArgs();

  return co(function *() {
    return yield rsync(yield args);
  })

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
