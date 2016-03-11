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

describe('initiate new DockDev project via individual functions', () => {
  var projectName = 'project1';
  var basePath = (0, _path.join)(__dirname, 'userFolder', projectName);
  var dockDevPath = (0, _path.join)(basePath, '.dockdev');
  var result = void 0;
  var configObj = void 0;

  before(() => {
    // make sure there is a userFolder
    try {
      (0, _fs.mkdirSync)((0, _path.join)(__dirname, 'userFolder'));
    } catch (e) {}

    // remove project folder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project folder
    (0, _fs.mkdirSync)(basePath);
  });

  it('createConfig should create a config object with a unique id and project name', () => {
    configObj = utils.createConfig(basePath, projectName);
    (0, _chai.expect)(configObj.projectName).to.equal('project1');
    (0, _chai.expect)(configObj.uuid).to.be.a('string');
    (0, _chai.expect)(configObj.basePath).to.be.a('string');
  });

  it('createDockDev should create .dockdev folder when none exists', () => {
    result = utils.createDockDev(configObj);
    return result.then(data => (0, _chai.expect)(data).to.equal(configObj));
  });

  it('writeConfig should write a specified object to the configFile', () => {
    return result.then(utils.writeConfig).then(data => (0, _fs.readFileSync)((0, _path.join)(data.basePath, '.dockdev', 'dockdev.json'))).then(_ramda2.default.toString).then(JSON.parse).then(data => (0, _chai.expect)(data).to.deep.equal(_ramda2.default.pick(utils.configWriteParams, configObj)));
  });

  it('addConfigToMemory should add the config object to the apps memory object', () => {
    utils.addConfigToMemory(utils.memory, configObj);
    (0, _chai.expect)(utils.memory[configObj.uuid]).to.equal(configObj);
  });

  it('createDockDev should fail when the folder already exists', () => {
    var tryAgain = utils.createDockDev(configObj);
    return tryAgain.then(data => (0, _chai.expect)(data).to.equal(undefined), err => (0, _chai.expect)(err.code).to.equal('EEXIST'));
  });
});

describe('initiate new DockDev project via initiateProject', () => {
  var projectName = 'project2';
  var basePath = (0, _path.join)(__dirname, 'userFolder', projectName);
  var dockDevPath = (0, _path.join)(basePath, '.dockdev');
  var result = void 0;

  before(() => {
    // make sure there is a userFolder
    try {
      (0, _fs.mkdirSync)((0, _path.join)(__dirname, 'userFolder'));
    } catch (e) {}

    // remove project folder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project folder
    (0, _fs.mkdirSync)(basePath);
  });

  it('should create a configObj', () => {
    result = utils.initiateProject(basePath, projectName);
    return result.then(data => {
      (0, _chai.expect)(data).to.be.an('object');
      (0, _chai.expect)(data.uuid).to.be.a('string');
      (0, _chai.expect)(data.projectName).to.equal(projectName);
      (0, _chai.expect)(data.basePath).to.equal(basePath);
    });
  });

  it('should write the config file to dockdev.json', () => {
    return result.then(data => (0, _fs.readFileSync)((0, _path.join)(basePath, '.dockdev', 'dockdev.json'))).then(_ramda2.default.toString).then(JSON.parse).then(data => result.then(orig => (0, _chai.expect)(_ramda2.default.pick(utils.configWriteParams, orig)).to.deep.equal(data)));
  });

  it('should add the config to app memory', () => {
    return result.then(data => (0, _chai.expect)(data).to.equal(utils.memory[data.uuid]));
  });

  it('should fail if a project already exists', () => {
    return utils.initiateProject(basePath, projectName).then(data => (0, _chai.expect)(data).to.be(undefined)).catch(err => (0, _chai.expect)(err.code).to.equal('EEXIST'));
  });
});

describe('read and modify an existing project', () => {
  var projectName = 'project3';
  var basePath = (0, _path.join)(__dirname, 'userFolder', projectName);
  var dockDevPath = (0, _path.join)(basePath, '.dockdev');
  var result = void 0;

  before(() => {
    // make sure there is a userFolder
    try {
      (0, _fs.mkdirSync)((0, _path.join)(__dirname, 'userFolder'));
    } catch (e) {}

    // remove project folder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project folder
    (0, _fs.mkdirSync)(basePath);

    result = utils.initiateProject(basePath, projectName);
  });

  // this should probably be moved to the existing project tests (project2)
  it('readConfig should read an existing config file returning an object', () => {
    return result.then(data => utils.readConfig(data.basePath)).then(data => result.then(orig => (0, _chai.expect)(data).to.deep.equal(orig)));
  });
});
