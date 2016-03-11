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

describe('initiate new DockDev project', () => {
  var path = (0, _path.join)(__dirname, 'userFolder', 'project1');
  var dockDevPath = (0, _path.join)(path, '.dockdev');
  var result;
  var configObj;

  // remove .dockdev folder -- this is for testing only
  before(() => _rimraf2.default.sync(dockDevPath));

  it('createDockDev should create .dockdev folder when none exists', () => {
    result = utils.createDockDev(path);
    return result.then(data => (0, _chai.expect)(data).to.equal(dockDevPath));
  });

  it('createDockDev should fail when the folder already exists', () => {
    var tryAgain = utils.createDockDev(path);
    return tryAgain.then(data => (0, _chai.expect)(data).to.equal(undefined), err => (0, _chai.expect)(err.code).to.equal('EEXIST'));
  });

  it('createConfig should create a config object with a unique id and project name', () => {
    configObj = utils.createConfig('project1');
    (0, _chai.expect)(configObj.projectName).to.equal('project1');
    (0, _chai.expect)(configObj.uuid).to.be.a('string');
  });

  it('writeConfig should write a specified object to the configFile', () => {
    return result.then(utils.writeConfig(configObj)).then(_fs.readFileSync).then(_ramda2.default.toString).then(JSON.parse).then(data => (0, _chai.expect)(data).to.deep.equal(configObj));
  });
});

xdescribe('read and modify an existing project', () => {
  // this should probably be moved to the existing project tests (project2)
  it('readConfig should read an existing config file returning an object', () => {
    return result.then(utils.readConfig).then(data => (0, _chai.expect)(data).to.deep.equal(configObj));
  });
});
