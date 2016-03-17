'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setContainerParams = exports.logs = exports.pull = exports.remove = exports.restart = exports.create = exports.inspect = exports.list = exports.stop = exports.start = undefined;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _machine = require('./machine.js');

var machine = _interopRequireWildcard(_machine);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _child_process = require('child_process');

var child_process = _interopRequireWildcard(_child_process);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const exec = _bluebird2.default.promisify(child_process.exec);

// save, commit, search, build, archive

const dockerCommands = {
  start: {
    cmd: 'start',
    method: 'POST',
    uri: function (containerId) {
      return `/containers/${ containerId }/${ this.cmd }`;
    }
  },
  stop: {
    cmd: 'stop',
    method: 'POST',
    uri: function (containerId) {
      return `/containers/${ containerId }/${ this.cmd }`;
    }
  },
  inspect: {
    cmd: 'json',
    method: 'GET',
    uri: function (containerId) {
      return `/containers/${ containerId }/${ this.cmd }`;
    }
  },
  list: {
    cmd: 'json',
    method: 'GET',
    uri: function () {
      return `/containers/${ this.cmd }`;
    }
  },
  create: {
    cmd: 'create',
    method: 'POST',
    uri: function () {
      return `/containers/${ this.cmd }`;
    }
  },
  restart: {
    cmd: 'restart',
    method: 'POST',
    uri: function (containerId) {
      return `/containers/${ containerId }/${ cmd }`;
    }
  },
  remove: {
    cmd: '',
    method: 'DELETE',
    uri: function (containerId) {
      return `/containers/${ containerId }?v=1&force=1`;
    }
  }
};

function commandMaker(cmd) {
  return (0, _bluebird.coroutine)(function* (machineName, containerInfo) {
    const config = yield machine.config(machineName);
    config.uri += cmd.uri(containerInfo);
    config.method = cmd.method;
    config.json = true;
    if (cmd.cmd === 'create') config.body = containerInfo;
    return yield (0, _requestPromise2.default)(config);
  });
}

const start = exports.start = commandMaker(dockerCommands.start);
const stop = exports.stop = commandMaker(dockerCommands.stop);
const list = exports.list = commandMaker(dockerCommands.list);
const inspect = exports.inspect = commandMaker(dockerCommands.inspect);
const create = exports.create = commandMaker(dockerCommands.create);
const restart = exports.restart = commandMaker(dockerCommands.restart);
const remove = exports.remove = commandMaker(dockerCommands.remove);

const pull = exports.pull = (0, _bluebird.coroutine)(function* (machineName, image) {
  let env = yield machine.env(machineName);
  env = _ramda2.default.fromPairs(env.split('\n').slice(0, 4).map(val => val.substr(7).split('=')));
  for (var prop in env) {
    var len = env[prop].length - 2;
    env[prop] = env[prop].substr(1).substr(0, len);
  }
  return yield exec(`docker pull ${ image }`, { env: env });
});

const logs = exports.logs = (0, _bluebird.coroutine)(function* (machineName, containerId) {
  let env = yield machine.env(machineName);
  env = _ramda2.default.fromPairs(env.split('\n').slice(0, 4).map(val => val.substr(7).split('=')));
  for (var prop in env) {
    var len = env[prop].length - 2;
    env[prop] = env[prop].substr(1).substr(0, len);
  }
  return yield exec(`docker logs ${ containerId }`, { env: env });
});

const setContainerParams = exports.setContainerParams = image => ({
  image: image,
  Volumes: { '/mnt': {} }
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