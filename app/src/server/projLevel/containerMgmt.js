import { coroutine as co } from 'bluebird';
import defaultConfig from '../appLevel/defaultConfig';
import { writeContainer } from './projConfig';
import {
  containerRemove,
  imagesList,
  containerCreate,
  pullImage,
  networkCreate,
  networkDelete,
} from '../dockerAPI/docker';

/**
 * setServerParams() returns an object with the image, project path, network mode, and working dir
 * based on the passed in image and project uuid
 *
 * @param {String} image
 * @param {String} uuid
 * @return {Object} returns an object with the image, project path, network mode, and working dir
 */
export const setServerParams = (image, cleanName) => ({
  image,
  name: `${cleanName}_${image}`,
  HostConfig: {
    Binds: [`${defaultConfig.dest}:${defaultConfig.workDir}`],
    NetworkMode: cleanName,
    PortBindings: { [`${defaultConfig.port}/tcp`]: [{ HostPort: `${defaultConfig.port}` }] },
  },
  WorkingDir: defaultConfig.workDir,
  Cmd: defaultConfig.serverCmd,
  ExposedPorts: {
    [`${defaultConfig.port}/tcp`]: {},
  },
});

/**
 * setDbParams() returns an object with the networkMode
 * based on the passed in image and project uuid
 *
 * @param {String} image
 * @param {String} uuid
 * @return {Object} returns an object with the networkMode
 */
export const setDbParams = (image, cleanName) => ({
  image,
  name: `${cleanName}_${image}`,
  HostConfig: {
    NetworkMode: cleanName,
  },
});

/**
 * getContainerConfig() returns the container config object controlling for server or db
 *
 * @param {Object} imageObj
 * @return {Object} returns the docker configuration object to create a container
 */
const getContainerConfig = (container, imageObj) => (
  imageObj.server ?
    setServerParams(imageObj.name, container.cleanName) :
    setDbParams(imageObj.name, container.cleanName)
);

/**
 * setNetworkParams() returns an object with the project uuid
 * based on the passed in project uuid
 *
 * @param {String} uuid
 * @return {Object} returns an object with the uuid
 */
export const setNetworkParams = (cleanName) => ({
  name: cleanName,
});

/**
 * createProjectNetwork() creates a new network for the project
 *
 * @param {Object} projObj
 * @return {Promise} returns true or throws an error if unable to create the network
 */
export const createProjectNetwork = (projObj) =>
  networkCreate(defaultConfig.machine, setNetworkParams(projObj.cleanName))
    .then(() => true);

/**
 * deleteProjectNetwork() creates a new network for the project
 *
 * @param {Object} projObj
 * @return {Promise} returns true or throws an error if unable to delete the network
 */
export const deleteProjectNetwork = (projObj, ignoreErrors) =>
  networkDelete(defaultConfig.machine, setNetworkParams(projObj.cleanName))
    .then(() => true)
    .catch(err => {
      if (!ignoreErrors) throw err;
    });


/**
 * containerObj() returns the base container object based on the project and image
 *
 * @param {String} cleanName
 * @param {Object} imageObj
 * @return {Object} returns a baseline container object
 */
const containerObj = (cleanName, imageObj) => ({
  cleanName,
  image: imageObj.name,
  dockerId: '',
  name: `${cleanName}_${imageObj.name}`,
  dest: (imageObj.server ? defaultConfig.dest : ''),
  server: imageObj.server,
  status: 'pending',
  machine: defaultConfig.machine,
});

export const createContainer = co(function *g(projObj, imageObj) {
  const container = containerObj(projObj.cleanName, imageObj);

  // if the image is not available on the local machine then tell UI pull it
  if (!(yield imagesList(defaultConfig.machine, imageObj.name)).length) {
    container.status = 'pull_image';
  } else {
    // create the container & update the object with the docker generated id
    container.dockerId =
      (yield containerCreate(defaultConfig.machine, getContainerConfig(container, imageObj))).Id;
    container.status = 'complete';
  }

  // write changes to project file
  yield writeContainer(container, projObj.basePath);
  return container;
});

export const pullImageForProject = co(function *g(container, path) {
  yield pullImage(container.machine, container.image);

  const newContainer = { ...containerObj, status: 'complete' };
  yield writeContainer(newContainer, path);
  return newContainer;
});


/**
 * add() returns a new container object. It will first attempt to use a local image
 * but if not found it will pull an image from the docker API
 * then it will create a container and return an object with container info
 * based on the passed in uuid, image, and callbacky
 *
 * @param {String} uuid
 * @param {String} image
 * @param {Function} callback
 * @return {Object} newContainer
 */
// export const add = co(function *g(cleanName, imageObj) {
//   const containerConfig = server ? setServerParams(image, uuid) : setDbParams(image, uuid);
//
//   // check to make sure image is on the local computer
//   if (!(yield imagesList(defaultConfig.machine, image)).length) {
//     try {
//       yield pullSpawn(defaultConfig.machine, image, uuid, server, containerId, callback);
//     } catch (err) {
//       return callback(uuid, { containerId, image, server, status: 'error', err });
//     }
//   }
//
//   const tmpContainerId = containerId;
//   containerId = (yield containerCreate(defaultConfig.machine, containerConfig)).Id;
//   const inspectContainer = yield containerInspect(defaultConfig.machine, containerId);
//   const dest = inspectContainer.Mounts[0].Source;
//
//   return newContainer;
// });

/**
 * removeContainer() returns true after it deletes a container
 * and removes it from the projcet object
 * based on the passed in project object and containerId
 *
 * @param {Object} projObj
 * @param {String} containerId
 * @return {Boolean} true
 */
export const removeContainer = co(function *g(projObj, containerId) {
  if (projObj.containers[containerId].status === 'complete') {
    yield containerRemove(projObj.machine, containerId);
  }
  return true;
});
