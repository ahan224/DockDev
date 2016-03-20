'use strict';

import rp from 'request-promise';
import * as machine from './machine.js';
import Promise, { coroutine as co } from 'bluebird';
import R from 'ramda';
import * as child_process from 'child_process';

const exec = Promise.promisify(child_process.exec);

// save, commit, search, build, archive

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
  restart: {
    cmd: 'restart',
    method: 'POST',
    uri(containerId) {
      return `/containers/${ containerId }/${ cmd }`;
    }
  },
  remove: {
    cmd: '',
    method: 'DELETE',
    uri(containerId) {
      return `/containers/${ containerId }?v=1&force=1`;
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
export const restart = commandMaker(dockerCommands.restart);
export const remove = commandMaker(dockerCommands.remove);


export const pull = co(function *(machineName, image) {
  let env = yield machine.env(machineName);
  return yield exec(`docker pull ${ image }`, { env });
});

export const deploy = co(function *(machineName, image) {
  let env = yield machine.env(machineName);
  return yield exec(`docker save ${ image } > tempImage.tar && docker-machine ssh ${ machineName } docker load < tempImage.tar`, { env });
});

export const logs = co(function *(machineName, containerId) {
  let env = yield machine.env(machineName);
  return yield exec(`docker logs ${ containerId }`, { env });
});

export const setContainerParams = (image, projObj) => ({
  image,
  // Volumes: { '/mnt': {} }
  HostConfig: {
    Binds: [`/home/docker/dockdev/${ projObj.uuid }:/app`]
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
