import { coroutine as co } from 'bluebird';
import defaultConfig from '../appLevel/defaultConfig';
import {
  containerRemove,
  imagesList,
  containerCreate,
  containerInspect,
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
  HostConfig: {
    Binds: ['/home/docker/tmp:/app'],
    NetworkMode: cleanName,
    PortBindings: { '3000/tcp': [{ HostPort: '3000' }] },
  },
  WorkingDir: '/app',
  Cmd: ['npm', 'start'],
  ExposedPorts: {
    '3000/tcp': {},
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
  HostConfig: {
    NetworkMode: cleanName,
  },
});

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
 * createContainerObj() returns the base container object based on the project and image
 *
 * @param {String} cleanName
 * @param {Object} imageObj
 * @return {Object} returns a baseline container object
 */
export const createContainerObj = (cleanName, imageObj) => ({
  image: imageObj.name,
  dockerId: '',
  name: `${cleanName}_${imageObj.name}`,
  dest: '',
  server: imageObj.server,
  status: 'pending',
});

// check image status
// pull image if necessary -- from docker API
// add container


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
export const add = co(function *g(cleanName, imageObj) {
  const containerConfig = server ? setServerParams(image, uuid) : setDbParams(image, uuid);

  // check to make sure image is on the local computer
  if (!(yield imagesList(defaultConfig.machine, image)).length) {
    try {
      yield pullSpawn(defaultConfig.machine, image, uuid, server, containerId, callback);
    } catch (err) {
      return callback(uuid, { containerId, image, server, status: 'error', err });
    }
  }

  const tmpContainerId = containerId;
  containerId = (yield containerCreate(defaultConfig.machine, containerConfig)).Id;
  const inspectContainer = yield containerInspect(defaultConfig.machine, containerId);
  const dest = inspectContainer.Mounts[0].Source;

  return newContainer;
});

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
