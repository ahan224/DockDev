import { spawn } from 'fs';
import { cmdLine } from './utils.js';

// dockerMachine :: string -> promise(string)
// accepts an array of cmd line args for docker-machine
// returns a promise that resolves to the stdout
export const dockerMachine = cmdLine('docker-machine');

// creates a Droplet on DigitalOcean
//** promisify this function
const createDroplet = (accessToken, dropletName) => {
 dropletName = "test9";
 accessToken = 'eedf80c21a790ed8328a1f64447a2b239ba98c8137051a362b8bee89530968a7';
 return spawn('docker-machine', ['create', '--driver', 'digitalocean', '--digitalocean-access-token', accessToken, dropletName]);
}

// also stops a Droplet on digitalocean
const stopMachine = machineName => dockerMachine(`stop ${ machineName }`);

// also removes a Droplet on DigitalOcean
const removeMachine = machineName => dockerMachine(`rm -y ${ machineName }`);
