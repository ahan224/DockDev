import * as docker from '../dockerAPI/docker';
import { coroutine as co } from 'bluebird';
import defaultConfig from '../appLevel/defaultConfig';
import * as availableImages from '../appLevel/availableImages';
import uuidNode from 'node-uuid';

/**
 * setServerParams() returns an object with the image, project path, network mode, and working dir
 * based on the passed in image and project uuid
 *
 * @param {String} image
 * @param {String} uuid
 * @return {Object} returns an object with the image, project path, network mode, and working dir
 */
export const setServerParams = (image, uuid, containerName) => ({
  image,
  containerName,
  HostConfig: {
    Binds: ['/home/docker/tmp:/app'],
    NetworkMode: uuid,
    PortBindings: { '3000/tcp': [{ HostPort: '3000' }] },
    Dns: [],
    DnsOptions: [],
    DnsSearch: [],
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
export const setDbParams = (image, uuid, containerName) => ({
  image,
  containerName,
  HostConfig: {
    NetworkMode: uuid,
    Dns: [],
    DnsOptions: [],
    DnsSearch: [],
  },
});

/**
 * setNetworkParams() returns an object with the project uuid
 * based on the passed in project uuid
 *
 * @param {String} uuid
 * @return {Object} returns an object with the uuid
 */
export const setNetworkParams = (uuid) => ({
  name: uuid,
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
export const add = co(function *g(uuid, image, callback, projectName, currContainers) {
  const server = availableImages.servers.indexOf(image) > -1;
  const containerName = projectName + image;
  const containerConfig =
    server ? setServerParams(image, uuid, containerName) : setDbParams(image, uuid, containerName);

  for (const key in currContainers) {
    if (currContainers[key].image === containerConfig.image) {
      return;
    }
  }

  let containerId = uuidNode.v4();

  callback(uuid, { containerId, image, server, status: 'pending', data: '' });

  // check to make sure image is on the local computer
  if (!(yield docker.imagesList(defaultConfig.machine, image)).length) {
    try {
      yield docker.pullSpawn(defaultConfig.machine, image, uuid, server, containerId, callback);
    } catch (err) {
      return callback(uuid, { containerId, image, server, status: 'error', err });
    }
  }

  const tmpContainerId = containerId;
  containerId = (yield docker.containerCreate(defaultConfig.machine, containerConfig)).Id;
  const inspectContainer = yield docker.containerInspect(defaultConfig.machine, containerId);
  const dest = inspectContainer.Mounts[0].Source;
  const name = inspectContainer.Name.substr(1);
  const newContainer = {
    uuid,
    image,
    tmpContainerId,
    containerId,
    name,
    dest,
    server,
    status: 'complete',
  };

  callback(uuid, newContainer);
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
    yield docker.containerRemove(projObj.machine, containerId);
  }
  return true;
});
