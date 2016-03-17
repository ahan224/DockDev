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

var exec = _bluebird2.default.promisify(child_process.exec);

// save, commit, search, build, archive

var dockerCommands = {
  start: {
    cmd: 'start',
    method: 'POST',
    uri: function uri(containerId) {
      return '/containers/' + containerId + '/' + this.cmd;
    }
  },
  stop: {
    cmd: 'stop',
    method: 'POST',
    uri: function uri(containerId) {
      return '/containers/' + containerId + '/' + this.cmd;
    }
  },
  inspect: {
    cmd: 'json',
    method: 'GET',
    uri: function uri(containerId) {
      return '/containers/' + containerId + '/' + this.cmd;
    }
  },
  list: {
    cmd: 'json',
    method: 'GET',
    uri: function uri() {
      return '/containers/' + this.cmd;
    }
  },
  create: {
    cmd: 'create',
    method: 'POST',
    uri: function uri() {
      return '/containers/' + this.cmd;
    }
  },
  restart: {
    cmd: 'restart',
    method: 'POST',
    uri: function uri(containerId) {
      return '/containers/' + containerId + '/' + cmd;
    }
  },
  remove: {
    cmd: '',
    method: 'DELETE',
    uri: function uri(containerId) {
      return '/containers/' + containerId + '?v=1&force=1';
    }
  }
};

function commandMaker(cmd) {
  return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(machineName, containerInfo) {
    var config;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return machine.config(machineName);

          case 2:
            config = _context.sent;

            config.uri += cmd.uri(containerInfo);
            config.method = cmd.method;
            config.json = true;
            if (cmd.cmd === 'create') config.body = containerInfo;
            _context.next = 9;
            return (0, _requestPromise2.default)(config);

          case 9:
            return _context.abrupt('return', _context.sent);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}

var start = exports.start = commandMaker(dockerCommands.start);
var stop = exports.stop = commandMaker(dockerCommands.stop);
var list = exports.list = commandMaker(dockerCommands.list);
var inspect = exports.inspect = commandMaker(dockerCommands.inspect);
var create = exports.create = commandMaker(dockerCommands.create);
var restart = exports.restart = commandMaker(dockerCommands.restart);
var remove = exports.remove = commandMaker(dockerCommands.remove);

var pull = exports.pull = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(machineName, image) {
  var env, prop, len;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return machine.env(machineName);

        case 2:
          env = _context2.sent;

          env = _ramda2.default.fromPairs(env.split('\n').slice(0, 4).map(function (val) {
            return val.substr(7).split('=');
          }));
          for (prop in env) {
            len = env[prop].length - 2;

            env[prop] = env[prop].substr(1).substr(0, len);
          }
          _context2.next = 7;
          return exec('docker pull ' + image, { env: env });

        case 7:
          return _context2.abrupt('return', _context2.sent);

        case 8:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
}));

var logs = exports.logs = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(machineName, containerId) {
  var env, prop, len;
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return machine.env(machineName);

        case 2:
          env = _context3.sent;

          env = _ramda2.default.fromPairs(env.split('\n').slice(0, 4).map(function (val) {
            return val.substr(7).split('=');
          }));
          for (prop in env) {
            len = env[prop].length - 2;

            env[prop] = env[prop].substr(1).substr(0, len);
          }
          _context3.next = 7;
          return exec('docker logs ' + containerId, { env: env });

        case 7:
          return _context3.abrupt('return', _context3.sent);

        case 8:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, this);
}));

var setContainerParams = exports.setContainerParams = function setContainerParams(image, projObj) {
  return {
    image: image,
    // Volumes: { '/mnt': {} }
    HostConfig: {
      Binds: ['/home/docker/dockdev/' + projObj.uuid + ':/app']
    }
  };
};

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