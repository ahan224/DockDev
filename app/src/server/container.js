import rp from 'request-promise';
import * as machine from './machine.js';
import Promise, { coroutine as co } from 'bluebird';
import { exec as childExec } from 'child_process';

// promisify callback function
const exec = Promise.promisify(childExec);

/**
* @param {Object} dockerCommands that will be passed into the command line function below
*/
const dockerCommands = {
  // starts a container
  start: {
    cmd: 'start',
    method: 'POST',
    uri(containerId) {
      return `/containers/${containerId}/${this.cmd}`;
    }
  },
  // stops a container
  stop: {
    cmd: 'stop',
    method: 'POST',
    uri(containerId) {
      return `/containers/${containerId}/${this.cmd}`;
    }
  },
  // inspects a container
  inspect: {
    cmd: 'json',
    method: 'GET',
    uri(containerId) {
      return `/containers/${containerId}/${this.cmd}`;
    }
  },
  // creates a list of containers
  list: {
    cmd: 'json',
    method: 'GET',
    uri() {
      return `/containers/${this.cmd}`;
    }
  },
  // creates a container
  create: {
    cmd: 'create',
    method: 'POST',
    uri() {
      return `/containers/${this.cmd}`;
    }
  },
  // restarts a container
  restart: {
    cmd: 'restart',
    method: 'POST',
    uri(containerId) {
      return `/containers/${containerId}/${this.cmd}`;
    }
  },
  // removes a container
  remove: {
    cmd: '',
    method: 'DELETE',
    uri(containerId) {
      return `/containers/${containerId}?v=1&force=1`;
    }
  }
};

/**
 * commandMaker() returns an anonymous function that takes 2 parameters
 * based on the passed in command object, which represents a task to perform in the command line
 *
 * @param {Object} cmd
 * @return {Function} returning anonymous function that takes 2 parameters
 */
function commandMaker(cmd) {
  return co(function *g(machineName, containerInfo) {
    const config = yield machine.machineConfig(machineName);
    config.uri += cmd.uri(containerInfo);
    config.method = cmd.method;
    config.json = true;
    if (cmd.cmd === 'create') config.body = containerInfo;
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
export const start = commandMaker(dockerCommands.start);
export const stop = commandMaker(dockerCommands.stop);
export const list = commandMaker(dockerCommands.list);
export const inspect = commandMaker(dockerCommands.inspect);
export const create = commandMaker(dockerCommands.create);
export const restart = commandMaker(dockerCommands.restart);
export const remove = commandMaker(dockerCommands.remove);

/**
 * pull() returns a promise to execute a docker command, 'pull' which will pull
 * an image from the registry/ host
 * based on the passed in machine name and image
 *
 * @param {String} machineName
 * @param {String} image
 * @return {} returns a promise to pull the image
 */
export const pull = co(function *g(machineName, image) {
  const env = yield machine.env(machineName);
  return yield exec(`docker pull ${image}`, { env });
});

/**
 * sendImage() returns a promise to execute a series of docker commands:
 *   'save', 'docker-machine ssh', and 'docker load' which will
 * send an image to the registry/ host
 * based on the passed in machine name and image
 *
 * @param {String} machineName
 * @param {String} image
 * @return {} returns a promise to send the image to the host
 */
export const sendImage = co(function *g(machineName, image) {
  const env = yield machine.env(machineName);
  return yield exec(`docker save ${image} > tempImage.tar && docker-machine ssh
    ${machineName} docker load < tempImage.tar`, { env });
});

/**
 * logs() returns a promise to execute docker logs on the command line
 * based on the passed in machine name and container id
 *
 * @param {String} machineName
 * @param {String} containreId
 * @return {} returns a promise to execute docker logs
 */
export const logs = co(function *g(machineName, containerId) {
  const env = yield machine.env(machineName);
  return yield exec(`docker logs ${containerId}`, { env });
});

/**
 * setContainerParams() returns an object with the image and path to uuid
 * based on the passed in image and project object
 *
 * @param {String} image
 * @param {Object} projObj
 * @return {Object} returns an object with the image and path to uuid
 */
export const setContainerParams = (image, projObj) => ({
  image,
  HostConfig: {
    Binds: [`/home/docker/dockdev/${projObj.uuid}:/app`]
  }
});

// need to think about how to pick a default machine
// for now it is hardcoded to 'default' but shouldnt be

/**
 * addContainer() will create a container through the docker API
 * then it will add infromation about the container to the projObj
 * then it returns a string with the containerId
 * based on the passed in project object and image
 *
 * @param {Object} projObj
 * @param {String} image
 * @return {String} containerId
 */
export const addContainer = co(function *g(projObj, image) {
  const containerConfig = setContainerParams(image, projObj);
  const containerId = (yield create(projObj.machine, containerConfig)).Id;
  const inspectContainer = yield inspect(projObj.machine, containerId);
  const dest = inspectContainer.Mounts[0].Source;
  const name = inspectContainer.Name.substr(1);
  const newContainer = { image, containerId, name, dest, sync: true };
  return [projObj, newContainer];
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
  yield remove(projObj.machine, containerId);
  delete projObj.containers[containerId];
  return true;
});

/**
 * manageProject() will perform an action on the project containers
 * functions that we will pass into the callback include:
 * start, stop, restart, and remove (see above)
 * based on initially passing in the project object and the callback
 *
 * @param {Object} projObj
 * @param {Function} containerFn
 * @return {} will perform an action on the project containers
 */
export const manageProject = co(function *(projObj, containerFn) {
  for (var key in projObj.containers) {
    containerFn(projObj.machine, key);
  }
});

// remove('default', 'f3e796d19685')
//   .then(console.log)
//   .catch(console.log);


// Example POST request to create a container
// POST /containers/create HTTP/1.1
// Content-Type: application/json
//
// {
//        "Hostname": "",
//        "Domainname": "",
//        "User": "",
//        "AttachStdin": false,
//        "AttachStdout": true,
//        "AttachStderr": true,
//        "Tty": false,
//        "OpenStdin": false,
//        "StdinOnce": false,
//        "Env": [
//                "FOO=bar",
//                "BAZ=quux"
//        ],
//        "Cmd": [
//                "date"
//        ],
//        "Entrypoint": "",
//        "Image": "ubuntu",
//        "Labels": {
//                "com.example.vendor": "Acme",
//                "com.example.license": "GPL",
//                "com.example.version": "1.0"
//        },
//        "Mounts": [
//          {
//            "Name": "fac362...80535",
//            "Source": "/data",
//            "Destination": "/data",
//            "Driver": "local",
//            "Mode": "ro,Z",
//            "RW": false,
//            "Propagation": ""
//          }
//        ],
//        "WorkingDir": "",
//        "NetworkDisabled": false,
//        "MacAddress": "12:34:56:78:9a:bc",
//        "ExposedPorts": {
//                "22/tcp": {}
//        },
//        "StopSignal": "SIGTERM",
//        "HostConfig": {
//          "Binds": ["/tmp:/tmp"],
//          "Links": ["redis3:redis"],
//          "Memory": 0,
//          "MemorySwap": 0,
//          "MemoryReservation": 0,
//          "KernelMemory": 0,
//          "CpuShares": 512,
//          "CpuPeriod": 100000,
//          "CpuQuota": 50000,
//          "CpusetCpus": "0,1",
//          "CpusetMems": "0,1",
//          "BlkioWeight": 300,
//          "BlkioWeightDevice": [{}],
//          "BlkioDeviceReadBps": [{}],
//          "BlkioDeviceReadIOps": [{}],
//          "BlkioDeviceWriteBps": [{}],
//          "BlkioDeviceWriteIOps": [{}],
//          "MemorySwappiness": 60,
//          "OomKillDisable": false,
//          "OomScoreAdj": 500,
//          "PortBindings": { "22/tcp": [{ "HostPort": "11022" }] },
//          "PublishAllPorts": false,
//          "Privileged": false,
//          "ReadonlyRootfs": false,
//          "Dns": ["8.8.8.8"],
//          "DnsOptions": [""],
//          "DnsSearch": [""],
//          "ExtraHosts": null,
//          "VolumesFrom": ["parent", "other:ro"],
//          "CapAdd": ["NET_ADMIN"],
//          "CapDrop": ["MKNOD"],
//          "GroupAdd": ["newgroup"],
//          "RestartPolicy": { "Name": "", "MaximumRetryCount": 0 },
//          "NetworkMode": "bridge",
//          "Devices": [],
//          "Ulimits": [{}],
//          "LogConfig": { "Type": "json-file", "Config": {} },
//          "SecurityOpt": [""],
//          "CgroupParent": "",
//          "VolumeDriver": "",
//          "ShmSize": 67108864
//       }
//   }
