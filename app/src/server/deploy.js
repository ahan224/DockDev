import { spawn } from 'child_process';
import Promise from 'bluebird';

/**
 * dropletOnOcean() returns a promise to create a droplet on DigitalOcean
 * based on the passed in accessToken and dropletName
 *
 * @param {String} accessToken
 * @param {String} dropletName
 * @return {} returns a promise to create a droplet on DigitalOcean
 */
const dropletOnOcean = (accessToken, dropletName) => {
  let result = '';
  const createDroplet = spawn('docker-machine',
    ['create', '--driver', 'digitalocean',
    '--digitalocean-access-token', accessToken, dropletName]);

  createDroplet.stdout.on('data', data => { result += data; });

  return new Promise((resolve, reject) => {
    createDroplet.stderr.on('data', reject);
    createDroplet.stdout.on('close', () => {
      resolve(result);
    });
  });
};

// createDroplet('eedf80c21a790ed8328a1f64447a2b239ba98c8137051a362b8bee89530968a7', 'test11');
