'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeContainer = exports.addContainer = exports.cmdLine = exports.initProject = exports.addToAppMemory = exports.addProjToMemory = exports.addProjToConfig = exports.readConfig = exports.loadPaths = exports.writeInitialConfig = exports.readProj = exports.writeProj = exports.createDockDev = exports.createProj = exports.memory = exports.config = exports.exec = exports.readFile = exports.writeFile = exports.mkdir = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _container = require('./container.js');

var container = _interopRequireWildcard(_container);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// promisify certain callback functions
var mkdir = exports.mkdir = _bluebird2.default.promisify(_fs2.default.mkdir);
var writeFile = exports.writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);
var readFile = exports.readFile = _bluebird2.default.promisify(_fs2.default.readFile);
var exec = exports.exec = _bluebird2.default.promisify(_child_process2.default.exec);

/**
* @param {object} config has project config settings
* @param {string} config.projFolder is where project config details are stored
* @param {string} config.projFile is projFile name for dockdev project config
* @param {[string]} config.projWriteParams list the project config props that will be written to disk
* @param {function} config.projPath is relative to a projects base path (i.e. user selected projFolder)
*/
var config = exports.config = {
  // main config infomration
  configFolder: '.dockdevConfig',
  configFile: 'dockdevConfig.json',
  configPath: function configPath() {
    return (0, _path.join)(process.env.HOME, this.configFolder, this.configFile);
  },


  // individual project infomration
  projFolder: '.dockdev',
  projFile: 'dockdev.json',
  projWriteParams: ['uuid', 'projectName', 'containers', 'machine'],
  projPath: function projPath() {
    return (0, _path.join)(this.projFolder, this.projFile);
  }
};

// object to store all projects
var memory = exports.memory = {};

// JSONStringifyPretty :: object -> string
// predefines JSON stringify with formatting
var JSONStringifyPretty = function JSONStringifyPretty(obj) {
  return JSON.stringify(obj, null, 2);
};

// createProj :: string -> string -> object
// accepts a project name & basePath, returns object with uuid
var createProj = exports.createProj = function createProj(basePath, projectName) {
  return {
    uuid: _nodeUuid2.default.v4(),
    projectName: projectName,
    basePath: basePath,
    containers: {},
    machine: 'default'
  };
};

// createDockDev :: object -> promise(object)
// initializes a new DockDev project by adding a .dockdev
var createDockDev = exports.createDockDev = function createDockDev(projObj) {
  return mkdir((0, _path.join)(projObj.basePath, config.projFolder));
};

// cleanProjToWrite :: object -> string
// removes in-memory properties to write config to dockdev.json
// also JSON stringifies with indent formatting
var cleanProjToWrite = _ramda2.default.compose(JSONStringifyPretty, _ramda2.default.pick(config.projWriteParams));

// writeProj :: string -> function -> object -> promise(object)
// writes the config object to the specified path
// it will overwrite any existing projFile.
// should be used with readProj for existing projects
var writeProj = exports.writeProj = function writeProj(projObj) {
  return writeFile((0, _path.join)(projObj.basePath, config.projPath()), cleanProjToWrite(projObj));
};

// addBasePath :: string -> string -> object
// takes a json string, parses it, and returns a new object with the basePath included
var addBasePath = function addBasePath(jsonObj, basePath) {
  return _ramda2.default.merge(JSON.parse(jsonObj), { basePath: basePath });
};

// readProj :: string -> promise(object)
// given a base path it will return the parsed JSON projFile
var readProj = exports.readProj = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(basePath) {
  var readProjFile;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return readFile((0, _path.join)(basePath, config.projPath()));

        case 2:
          readProjFile = _context.sent;
          return _context.abrupt('return', addBasePath(readProjFile, basePath));

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}));

var writeInitialConfig = exports.writeInitialConfig = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(userSelectedDirectory) {
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!userSelectedDirectory) userSelectedDirectory = process.env.HOME;
          _context2.next = 3;
          return mkdir((0, _path.join)(process.env.HOME, config.configFolder));

        case 3:
          _context2.next = 5;
          return writeFile(config.configPath(), JSONStringifyPretty({
            userSelectedDirectory: userSelectedDirectory,
            projects: {}
          }));

        case 5:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, this);
}));

var findDockdev = function findDockdev(array) {
  var result = '';
  var find = (0, _child_process.spawn)('find', array);

  find.stdout.on('data', function (data) {
    return result += data;
  });

  return new _bluebird2.default(function (resolve, reject) {
    find.stderr.on('data', reject);
    find.stdout.on('close', function () {
      resolve(result.split('\n').slice(0, -1));
    });
  });
};

// findDockdev(['/Users/dbschwartz83/DockDev', '-name', 'index.html'], handleFolders);

// after reading the main configFile, we are going to load all the paths
var loadPaths = exports.loadPaths = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(configFile, userSelectedDirectory) {
  var needToSearch, pathsToSendToUI, key, fileContents, searchArray, searchResultsToUI, searchResults, i, _fileContents;

  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          needToSearch = false;
          pathsToSendToUI = [];
          _context3.t0 = regeneratorRuntime.keys(configFile.projects);

        case 3:
          if ((_context3.t1 = _context3.t0()).done) {
            _context3.next = 21;
            break;
          }

          key = _context3.t1.value;
          _context3.prev = 5;
          _context3.t2 = JSON;
          _context3.next = 9;
          return readFile((0, _path.join)(configFile.projects[key], config.projPath()));

        case 9:
          _context3.t3 = _context3.sent;
          fileContents = _context3.t2.parse.call(_context3.t2, _context3.t3);

          pathsToSendToUI.push(fileContents);

          _context3.next = 19;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t4 = _context3['catch'](5);

          console.log(_context3.t4);
          needToSearch = true;
          delete configFile.projects[key];

        case 19:
          _context3.next = 3;
          break;

        case 21:
          if (!needToSearch) {
            _context3.next = 43;
            break;
          }

          searchArray = [];

          if (!userSelectedDirectory) userSelectedDirectory = process.env.HOME;
          // create the parameters for the linux find command
          searchArray.push(userSelectedDirectory);
          searchArray.push('-name');
          searchArray.push(config.projFile);
          for (key in configFile.projects) {

            // create the parameters for files to exclude based on the projects that were already found
            searchArray.push('!');
            searchArray.push('-path');
            searchArray.push(projects[key]);
          }
          searchResultsToUI = [];

          // returns an array of data

          _context3.next = 31;
          return findDockdev(searchArray);

        case 31:
          searchResults = _context3.sent;
          i = 0;

        case 33:
          if (!(i < searchResults.length)) {
            _context3.next = 43;
            break;
          }

          _context3.t5 = JSON;
          _context3.next = 37;
          return readFile((0, _path.join)(searchResults[i], config.projPath()));

        case 37:
          _context3.t6 = _context3.sent;
          _fileContents = _context3.t5.parse.call(_context3.t5, _context3.t6);

          searchResultsToUI.push(_fileContents);

        case 40:
          i++;
          _context3.next = 33;
          break;

        case 43:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, this, [[5, 14]]);
}));

// reads the main configFile at launch of the app, if the file doesn't exist, it writes the file

// send the data from searchResultsToUI to the UI

var readConfig = exports.readConfig = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4(userSelectedDirectory) {
  var readConfigFile;
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.t0 = JSON;
          _context4.next = 4;
          return readFile(config.configPath());

        case 4:
          _context4.t1 = _context4.sent;
          readConfigFile = _context4.t0.parse.call(_context4.t0, _context4.t1);
          _context4.next = 8;
          return loadPaths(readConfigFile, userSelectedDirectory);

        case 8:
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t2 = _context4['catch'](0);
          _context4.next = 14;
          return writeInitialConfig(userSelectedDirectory);

        case 14:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee4, this, [[0, 10]]);
}));

// adds projects uuid and paths to the main config file
var addProjToConfig = exports.addProjToConfig = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee5(basePath) {
  var readConfigFile;
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.t0 = JSON;
          _context5.next = 3;
          return readConfig(config.configPath());

        case 3:
          _context5.t1 = _context5.sent;
          readConfigFile = _context5.t0.parse.call(_context5.t0, _context5.t1);

          readConfigFile.projects[basePath] = basePath;
          _context5.next = 8;
          return writeFile(config.configPath(), JSONStringifyPretty(readConfigFile));

        case 8:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee5, this);
}));

// addProjToMemory :: object -> object -> object
// adds the projObj for the project to the memory object
var addProjToMemory = exports.addProjToMemory = _ramda2.default.curry(function (memory, projObj) {
  memory[projObj.uuid] = projObj;
  return projObj;
});

var addToAppMemory = exports.addToAppMemory = addProjToMemory(memory);

// initProject :: string -> string -> promise(object)
// combines the sequence of functions to initiate a new projects
// takes a path and a project name and returns the config object
var initProject = exports.initProject = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee6(basePath, projectName) {
  var projObj;
  return regeneratorRuntime.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          projObj = createProj(basePath, projectName);
          _context6.next = 3;
          return createDockDev(projObj);

        case 3:
          _context6.next = 5;
          return writeProj(projObj);

        case 5:

          addProjToConfig(basePath);
          addToAppMemory(projObj);

          return _context6.abrupt('return', projObj);

        case 8:
        case 'end':
          return _context6.stop();
      }
    }
  }, _callee6, this);
}));

// cmdLine :: string -> string -> promise(string)
// returns the stdout of the command line call within a promise
var cmdLine = exports.cmdLine = _ramda2.default.curry(function (cmd, args) {
  return exec(cmd + ' ' + args);
});

// need to think about how to pick a default machine
// for now it is hardcoded to 'default' but shouldnt be
var addContainer = exports.addContainer = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee7(projObj, image) {
  var containerConfig, containerId, inspectContainer, dest, name;
  return regeneratorRuntime.wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          containerConfig = container.setContainerParams(image, projObj);
          _context7.next = 3;
          return container.create(projObj.machine, containerConfig);

        case 3:
          containerId = _context7.sent.Id;
          _context7.next = 6;
          return container.inspect(projObj.machine, containerId);

        case 6:
          inspectContainer = _context7.sent;
          dest = inspectContainer.Mounts[0].Source;
          name = inspectContainer.Name.substr(1);

          projObj.containers[containerId] = { image: image, containerId: containerId, name: name, dest: dest, sync: true };
          return _context7.abrupt('return', containerId);

        case 11:
        case 'end':
          return _context7.stop();
      }
    }
  }, _callee7, this);
}));

var removeContainer = exports.removeContainer = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee8(projObj, containerId) {
  return regeneratorRuntime.wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return container.remove(projObj.machine, containerId);

        case 2:
          delete projObj.containers[containerId];
          return _context8.abrupt('return', true);

        case 4:
        case 'end':
          return _context8.stop();
      }
    }
  }, _callee8, this);
}));