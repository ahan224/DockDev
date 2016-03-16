'use strict';

import rp from 'request-promise';
import * as machine from './machine.js';
import { coroutine as co } from 'bluebird';
import { exec } from './utils.js';
import R from 'ramda';

// restart, remove, save, pull, logs, commit, search

const dockerCommands = {
  start: {
    cmd: 'start',
    method: 'POST',
    uri(containerId) {
      return `/containers/${ containerId }/${ this.cmd }`;
    }
  },
  stop: {
    cmd: 'stop',
    method: 'POST',
    uri(containerId) {
      return `/containers/${ containerId }/${ this.cmd }`;
    }
  },
  inspect: {
    cmd: 'json',
    method: 'GET',
    uri(containerId) {
      return `/containers/${ containerId }/${ this.cmd }`;
    }
  },
  list: {
    cmd: 'json',
    method: 'GET',
    uri() {
      return `/containers/${ this.cmd }`;
    }
  },
  create: {
    cmd: 'create',
    method: 'POST',
    uri() {
      return `/containers/${ this.cmd }`;
    }
  },
  pull: {
    cmd: 'pull',
    method: 'POST',
    uri(image) {
      return `/images/create?fromImage=${ image }`;
    }
  }
}

function commandMaker(cmd){
  return co(function *(machineName, containerInfo) {
    const config = yield machine.config(machineName);
    config.uri += cmd.uri(containerInfo);
    config.method = cmd.method;
    config.json = true;
    if (cmd.cmd === 'create') config.body = containerInfo;
    return yield rp(config);
  })
}

export const start = commandMaker(dockerCommands.start);
export const stop = commandMaker(dockerCommands.stop);
export const list = commandMaker(dockerCommands.list);
export const inspect = commandMaker(dockerCommands.inspect);
export const create = commandMaker(dockerCommands.create);

export const pull = co(function *(machineName, image) {
  let env = yield machine.env(machineName);
  env = R.fromPairs(env.split('\n').slice(0, 4).map(val => val.substr(7).split('=')));
  for (var prop in env) {
    var len = env[prop].length - 2;
    env[prop] = env[prop].substr(1).substr(0, len);
  }
  return yield exec(`docker pull ${ image }`, { env });
});


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
