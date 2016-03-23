import { spawn } from 'child_process';
import Promise from 'bluebird';
import defaultConfig from './defaultConfig';

/**
 * getOceanToken() returns the config object with the accessToken stored inside of it
 * based on the passed in accessToken from the user
 *
 * @param {String} accessToken
 * @return {String} returns the Token
 */
const getOceanToken = (accessToken) => {
  defaultConfig.DOToken = accessToken;
  return defaultConfig.DOToken;
};

/**
 * dropletOnOcean() returns a promise to create a droplet on DigitalOcean
 * based on the passed in accessToken and dropletName
 *
 * @param {String} accessToken
 * @param {String} dropletName
 * @return {} returns a promise to create a droplet on DigitalOcean
 */
const dropletOnOcean = (configObj, dropletName) => {

  let result = '';
  const createDroplet = spawn('docker-machine',
    ['create', '--driver', 'digitalocean',
    '--digitalocean-access-token', configObj.DOToken, dropletName]);

  createDroplet.stdout.on('data', data => { result += data; });

  return new Promise((resolve, reject) => {
    createDroplet.stderr.on('data', reject);
    createDroplet.stdout.on('close', () => {
      resolve(result);
    });
  });
};

// const DO = 'eedf80c21a790ed8328a1f64447a2b239ba98c8137051a362b8bee89530968a7'
