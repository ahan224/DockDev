import { createMachine } from '../dockerAPI/machine';

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

// export const createDockerFile = (serverContainer, )


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
//   yield writeFile('../Dockerfile',
//     "From node:latest\nCOPY . /app\nWORKDIR /app\nRUN ['npm', 'install']\nCMD ['npm', 'start']"
//   );
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
