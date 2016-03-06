const R = require('ramda');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

// cmdLine :: string -> [string] -> object
// returns the stdout of the command line call within a promise
const cmdLine = R.curry((cmd, args) => {
  args = `${ cmd } ${ args.join(' ') }`;
  return new Promise((resolve, reject) => {
    exec(args, (err, stdout) => {
      if (err) reject(err);
      resolve(stdout);
    });
  })
});

const dockerMachine = cmdLine('docker-machine');
const rsync = cmdLine('rsync');

// helper function to select properties from a nested object
const selectWithin = R.curry((array, key, obj) => {
  var result = {};
  array.forEach(val => result[val] = obj[key][val]);
  return result;
})

// createRsyncArgs :: string -> string -> object -> [string]
// accepts source, destination, and machine info
// returns an array of arguments for rsync
const createRsyncArgs = R.curry((source, dest, machine) => {
  const result = ['-a', '-e'];
  result.push(`"ssh -i ${ machine.SSHKeyPath } -o IdentitiesOnly=yes -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"`);
  result.push('--delete');
  result.push(source);
  result.push(`docker@${ machine.IPAddress }:${ dest }`)
  return result;
});

// selects ssh and ip address from object (docker-machine inspect)
const selectSSHandIP = R.compose(
  selectWithin(['SSHKeyPath', 'IPAddress'], 'Driver'),
  JSON.parse
);

const runRsync = (source, dest, machineName) => {
  dockerMachine(['inspect', machineName])
  .then(selectSSHandIP)
  .then(createRsyncArgs(source, dest))
  .then(rsync)
  .catch(console.log)
}

runRsync('./dir1', '~/test', 'sandbox');
