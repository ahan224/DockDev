import { join } from 'path';
import { createMachine } from '../dockerAPI/machine';
import { coroutine as co } from 'bluebird';
import { writeFile } from '../utils/utils';
import * as rsync from './rsync';
import { inspect, ssh } from '../dockerAPI/machine';
import defaultConfig from '../appLevel/defaultConfig';
import {
  FAILED_TO_CREATE_DOCKERFILE,
  FAILED_TO_SYNC_TO_REMOTE,
  FAILED_TO_BUILD_SERVER_IMAGE,
} from '../appLevel/errorMsgs';

/**
 * createDroplet() returns a promise to create a droplet on DigitalOcean
 * based on the dropletName and token.  Optional arguments are accepted.
 * See https://docs.docker.com/machine/drivers/digital-ocean/ for details.
 *
 * @param {String} dropletName
 * @param {String} token
 * @param {...String} options
 * @return {} returns a promise to create a droplet on DigitalOcean
 */
export const createDroplet = (dropletName, token, ...args) =>
  createMachine('--driver digitalocean',
    `--digitalocean-access-token=${token}`,
    ...args,
    dropletName
  );

/**
 * createDockerfile() creates a Dockerfile in the project base path
 *
 * @param {Object} containers
 * @param {String} basePath
 * @return {} returns a promise that is either true or throws an error
 */
export const createDockerfile = co(function *g(containers, basePath) {
  try {
    const server = containers.filter(cont => cont.server)[0];
    const dockerFile =
      `From ${server.image}\n` +
      'COPY . /app\n' +
      'WORKDIR /app\n' +
      'RUN ["npm", "install", "--production"]\n' +
      'CMD ["npm", "start"]';
    yield writeFile(`${basePath}/Dockerfile`, dockerFile);
    return true;
  } catch (e) {
    throw FAILED_TO_CREATE_DOCKERFILE;
  }
});

/**
 * syncFilesToRemote() syncs the project directory to the remote machine
 *
 * @param {String} basePath
 * @param {String} machineName
 * @return {} returns a promise that is either true or throws an error
 */
export const syncFilesToRemote = co(function *g(basePath, machineName, local = false) {
  const cleanPath = rsync.cleanFilePath(basePath);
  const dest = local ? '/home/docker' : defaultConfig.remoteDest;
  try {
    const machineInfo = rsync.selectSSHandIP(yield inspect(machineName));
    const remoteRsyncArgs =
      rsync.createRemoteRsyncArgs(`${cleanPath}/*`, dest, machineInfo, local);
    yield rsync.rsync(remoteRsyncArgs);
    return true;
  } catch (e) {
    throw FAILED_TO_SYNC_TO_REMOTE;
  }
});

const basePath = join(__dirname, '..', '..', '..', '..', 'example-deploy', 'deploy');

syncFilesToRemote(basePath, 'test2', true)
  .then(val => console.log(val))
  .catch(err => console.log(err));

export const buildServerImage = (cleanName, remoteObj) =>
  ssh(remoteObj.machine, `docker build -t dockdev/${cleanName}:${remoteObj.counter} .`)
    .then(() => true)
    .catch(() => {throw FAILED_TO_BUILD_SERVER_IMAGE;});

// /**
//  * getDbNames() returns the images and names of all the database in the project
//  * based on the passed in project object
//  *
//  * @param {Object} projObj
//  * @return {Array} dbImageNames
//  */
// function getDbNames(projObj) {
//   const dbImageNames = [];
//   for (const contId in projObj.containers) {
//     if (!projObj.containers[contId].server) {
//       dbImageNames.push(projObj.containers[contId].image);
//       dbImageNames.push(projObj.containers[contId].name);
//     }
//   }
//   return dbImageNames;
// }
//
// /**
//  * pullImagesOcean() returns true after pulling and running all the db images on DigitalOcean
//  * based on the passed in digital ocean machine neame and array of db images and names
//  *
//  * @param {String} dropletMachName
//  * @param {Array} dbNamesArr
//  * @return {Boolean} true
//  */
// const pullImagesOcean = co(function *g(dropletMachName, dbNamesArr) {
//   for (let i = 0; i < dbNamesArr.length; i += 2) {
//     try {
//       yield ssh(dropletMachName, `docker run -d --name ${dbNamesArr[i + 1]} ${dbNamesArr[i]}`);
//     } catch (e) {
//       console.log(e);
//     }
//   }
//   return true;
// });
//
// /**
//  * buildDockerFile() returns true after creating a Dockerfile
//  *
//  * @return {Boolean} true
//  */
// const buildDockerFile = co(function *g() {
//   // what if they deploy twice and it already exists??

//   return true;
// });
//
// /**
//  * deployToOcean() returns true after walking through a sequence of events to deploy
//  * a project to digital ocean
//  * based on the passed in project object, remote machine name, and access token
//  *
//  * @param {Object} projObj
//  * @param {String} accessToken
//  * @return {Boolean} true
//  */
// export const deployToOcean = co(function *g(projObj, accessToken) {
//   const remoteMachName = projObj.projectName.replace(' ', '_');
//   const Token = storeOceanToken(accessToken);
//   yield dropletOnOcean(Token, remoteMachName);
//   const dbNamesArray = getDbNames(projObj);
//   yield pullImagesOcean(remoteMachName, dbNamesArray);
//   yield buildDockerFile();
//   const remoteSync = generateRsync(projObj, 'remoteMachine');
//   yield remoteSync;
//   yield ssh(remoteMachName, 'docker build ./tmp');
//   return true;
// });
