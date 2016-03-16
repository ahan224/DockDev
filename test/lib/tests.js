'use strict';

var _chai = require('chai');

var _utils = require('../app/lib/utils.js');

var utils = _interopRequireWildcard(_utils);

var _path = require('path');

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _fs = require('fs');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('initiate new DockDev project via individual functions', function () {
  var projectName = 'project1';
  var basePath = (0, _path.join)(__dirname, 'userFolder', projectName);
  var dockDevPath = (0, _path.join)(basePath, '.dockdev');
  var result = void 0;
  var configObj = void 0;

  before(function () {
    // make sure there is a userFolder
    try {
      (0, _fs.mkdirSync)((0, _path.join)(__dirname, 'userFolder'));
    } catch (e) {}

    // remove project folder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project folder
    (0, _fs.mkdirSync)(basePath);
  });

  it('createConfig should create a config object with a unique id and project name', function () {
    configObj = utils.createConfig(basePath, projectName);
    (0, _chai.expect)(configObj.projectName).to.equal(projectName);
    (0, _chai.expect)(configObj.uuid).to.be.a('string');
    (0, _chai.expect)(configObj.basePath).to.be.a('string');
    (0, _chai.expect)(configObj.basePath).to.equal(basePath);
  });

  it('createDockDev should create .dockdev folder when none exists', function () {
    result = utils.createDockDev(configObj);
    return result.then(function () {
      (0, _chai.expect)((0, _fs.readdirSync)((0, _path.join)(configObj.basePath, utils.config.folder))).to.be.empty;
    });
  });

  it('writeConfig should write a specified object to the configFile', function () {
    return utils.writeConfig(configObj).then(function () {
      return (0, _fs.readFileSync)((0, _path.join)(configObj.basePath, '.dockdev', 'dockdev.json'));
    }).then(_ramda2.default.toString).then(JSON.parse).then(function (data) {
      return (0, _chai.expect)(data).to.deep.equal(_ramda2.default.pick(utils.config.writeParams, configObj));
    });
  });

  it('addConfigToMemory should add the config object to the apps memory object', function () {
    utils.addConfigToMemory(utils.memory, configObj);
    (0, _chai.expect)(utils.memory[configObj.uuid]).to.equal(configObj);
  });

  it('createDockDev should fail when the folder already exists', function () {
    var tryAgain = utils.createDockDev(configObj);
    return tryAgain.then(function (data) {
      return (0, _chai.expect)(data).to.equal(undefined);
    }, function (err) {
      return (0, _chai.expect)(err.code).to.equal('EEXIST');
    });
  });
});

describe('initiate new DockDev project via initiateProject', function () {
  var projectName = 'project2';
  var basePath = (0, _path.join)(__dirname, 'userFolder', projectName);
  var dockDevPath = (0, _path.join)(basePath, '.dockdev');
  var result = void 0;

  before(function () {
    // make sure there is a userFolder
    try {
      (0, _fs.mkdirSync)((0, _path.join)(__dirname, 'userFolder'));
    } catch (e) {}

    // remove project folder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project folder
    (0, _fs.mkdirSync)(basePath);
  });

  it('should create a configObj', function () {
    result = utils.initProject(basePath, projectName);
    return result.then(function (data) {
      (0, _chai.expect)(data).to.be.an('object');
      (0, _chai.expect)(data.uuid).to.be.a('string');
      (0, _chai.expect)(data.projectName).to.equal(projectName);
      (0, _chai.expect)(data.basePath).to.equal(basePath);
    });
  });

  it('should write the config file to dockdev.json', function () {
    return result.then(function () {
      return (0, _fs.readFileSync)((0, _path.join)(basePath, '.dockdev', 'dockdev.json'));
    }).then(_ramda2.default.toString).then(JSON.parse).then(function (data) {
      return result.then(function (orig) {
        return (0, _chai.expect)(_ramda2.default.pick(utils.config.writeParams, orig)).to.deep.equal(data);
      });
    });
  });

  it('should add the config to app memory', function () {
    return result.then(function (data) {
      return (0, _chai.expect)(data).to.equal(utils.memory[data.uuid]);
    });
  });

  it('should fail if a project already exists', function () {
    return utils.initProject(basePath, projectName).then(function (data) {
      return (0, _chai.expect)(data).to.be(undefined);
    }).catch(function (err) {
      return (0, _chai.expect)(err.code).to.equal('EEXIST');
    });
  });
});

describe('read and modify an existing project', function () {
  var projectName = 'project3';
  var basePath = (0, _path.join)(__dirname, 'userFolder', projectName);
  var dockDevPath = (0, _path.join)(basePath, '.dockdev');
  var result = void 0;

  before(function () {
    // make sure there is a userFolder
    try {
      (0, _fs.mkdirSync)((0, _path.join)(__dirname, 'userFolder'));
    } catch (e) {}

    // remove project folder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project folder
    (0, _fs.mkdirSync)(basePath);

    result = utils.initProject(basePath, projectName);
  });

  // this should probably be moved to the existing project tests (project2)
  it('readConfig should read an existing config file returning an object', function () {
    return result.then(function (data) {
      return utils.readConfig(data.basePath);
    }).then(function (data) {
      return result.then(function (orig) {
        return (0, _chai.expect)(data).to.deep.equal(orig);
      });
    });
  });
});