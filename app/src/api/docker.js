import rp from 'request-promise';
import * as machine from './machine.js';
import Promise, { coroutine as co } from 'bluebird';
import { spawn } from 'child_process';
import defaultConfig from './defaultConfig';
import * as availableImages from './availableImages';
import R from 'ramda';
import uuidNode from 'node-uuid';
import { exec as execProm } from './utils';

// promisify callback function
const exec = (args) => execProm(`docker ${args}`);

/**
* @param {Object} commands that will be passed into the command line function below
*/
const commands = {
  // starts a container
  containerStart: {
    cmd: 'start',
    method: 'POST',
    uri(containerId) {
      return `/containers/${containerId}/${this.cmd}`;
    },
  },
  // stops a container
  containerStop: {
    cmd: 'stop',
    method: 'POST',
    uri(containerId) {
      return `/containers/${containerId}/${this.cmd}`;
    },
  },
  // inspects a container
  containerInspect: {
    cmd: 'json',
    method: 'GET',
    uri(containerId) {
      return `/containers/${containerId}/${this.cmd}`;
    },
  },
  // creates a list of containers
  containerList: {
    cmd: 'json',
    method: 'GET',
    uri() {
      return `/containers/${this.cmd}`;
    },
  },
  // creates a container
  containerCreate: {
    cmd: 'create',
    method: 'POST',
    uri({ containerName }) {
      return `/containers/${this.cmd}?name=${containerName}`;
    },
  },
  // restarts a container
  containerRestart: {
    cmd: 'restart',
    method: 'POST',
    uri(containerId) {
      return `/containers/${containerId}/${this.cmd}`;
    },
  },
  // removes a container
  containerRemove: {
    cmd: '',
    method: 'DELETE',
    uri(containerId) {
      return `/containers/${containerId}?v=1&force=1`;
    },
  },
  // returns the list of images already on the local computer
  imagesList: {
    cmd: 'json',
    method: 'GET',
    uri(imageName) {
      if (imageName) return `/images/${this.cmd}?filter=${imageName}`;
      return `/images/${this.cmd}?all`;
    },
  },
  // creates a network for the containers
  networkCreate: {
    cmd: 'create',
    method: 'POST',
    uri() {
      return `/networks/${this.cmd}`;
    },
  },
  // inspects a network
  networkInspect: {
    cmd: '',
    method: 'GET',
    uri(uuid) {
      return `/networks/${uuid}`;
    },
  },
  // delete a network
  networkDelete: {
    cmd: '',
    method: 'DELETE',
    uri(uuid) {
      return `/networks/${uuid}`;
    },
  },
};

/**
 * commandMaker() returns a function that takes 2 parameters
 * based on the passed in command object, which represents a task to perform in the command line
 *
 * @param {Object} cmd
 * @return {Function} returns a function that takes 2 parameters
 */
function commandMaker(cmd) {
  return co(function *g(machineName, arg) {
    const config = yield machine.machineConfig(machineName);
    config.uri += cmd.uri(arg);
    config.method = cmd.method;
    config.json = true;
    if (cmd.cmd === 'create') config.body = arg;
    return yield rp(config);
  });
}

/**
 * each function below will take in two parameters and return a machine config object
 * which will have the information necessary to perform the commands on the Docker API
 *
 * @param {String} machineName
 * @param {String} containerInfo
 * @return {Object} returns a promise to supply the config object
 */
export const containerStart = commandMaker(commands.containerStart);
export const containerStop = commandMaker(commands.containerStop);
export const containerList = commandMaker(commands.containerList);
export const containerInspect = commandMaker(commands.containerInspect);
export const containerCreate = commandMaker(commands.containerCreate);
export const containerRestart = commandMaker(commands.containerRestart);
export const containerRemove = commandMaker(commands.containerRemove);
export const imagesList = commandMaker(commands.imagesList);
export const networkCreate = commandMaker(commands.networkCreate);
export const networkDelete = commandMaker(commands.networkDelete);
export const networkInspect = commandMaker(commands.networkInspect);

/**
 * pullSpawn() returns a promise to execute a docker command, 'pull' which will pull
 * an image from the registry/ host, during the data collection it sets the status to
 * pending and then yields a promise to resolve or reject the spawn command
 * based on the passed in machine name, image, uuid, container id, and callback
 *
 * @param {String} machineName
 * @param {String} image
 * @param {String} uuid
 * @param {String} containerId
 * @param {Function} callback
 * @return {} returns a promise to pull the image or reject if there is an error
 */
export const pullSpawn = co(function *g(machineName, image, uuid, server, containerId, callback) {
  const env = yield machine.env(machineName);
  process.env = R.merge(process.env, env);

  const pullReq = spawn('docker', ['pull', image]);

  pullReq.stdout.on('data', data =>
    callback(uuid, { containerId, image, server, status: 'pending', data }));

  yield new Promise((resolve, reject) => {
    pullReq.stderr.on('data', reject);
    pullReq.on('close', resolve);
  });
});

/**
 * pullImage() returns a promise to execute a docker command, 'pull' which will pull
 * an image from the registry/host
 *
 * @param {String} machineName
 * @param {String} image
 * @return {} returns a promise to pull the image or reject if there is an error
 */
export const pullImage = co(function *g(machineName, image) {
  const env = yield machine.env(machineName);
  return yield exec(`pull ${image}`, { env });
});

/**
 * logs() returns a promise to execute docker logs on the command line
 * based on the passed in machine name and container id
 *
 * @param {String} machineName
 * @param {String} containreId
 * @return {} returns a promise to execute docker logs
 */
export const containerLogs = co(function *g(machineName, containerId) {
  const env = yield machine.env(machineName);
  return yield exec(`logs ${containerId}`, { env });
});

/**
 * setServerParams() returns an object with the image, project path, network mode, and working dir
 * based on the passed in image and project uuid
 *
 * @param {String} image
 * @param {String} uuid
 * @return {Object} returns an object with the image, project path, network mode, and working dir
 */
export const setServerParams = (image, uuid) => ({
  image,
  name: 'server1',
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
export const setDbParams = (image, uuid) => ({
  image,
  name: 'mongo1',
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
export const add = co(function *g(uuid, image, callback) {
  const server = availableImages.servers.indexOf(image) > -1;
  const containerConfig = server ? setServerParams(image, uuid) : setDbParams(image, uuid);

  let containerId = uuidNode.v4();

  callback(uuid, { containerId, image, server, status: 'pending', data: '' });

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
    yield containerRemove(projObj.machine, containerId);
  }
  return true;
});
