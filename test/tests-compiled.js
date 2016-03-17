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

var _rsync = require('../app/lib/rsync.js');

var rsync = _interopRequireWildcard(_rsync);

var _fileWatch = require('../app/lib/fileWatch.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('initiate new DockDev project via individual functions', function () {
  var projectName = 'project1';
  var basePath = (0, _path.join)(__dirname, 'userFolder', projectName);
  var dockDevPath = (0, _path.join)(basePath, '.dockdev');
  var result = void 0;
  var projObj = void 0;

  before(function () {
    // make sure there is a userFolder
    try {
      (0, _fs.mkdirSync)((0, _path.join)(__dirname, 'userFolder'));
    } catch (e) {}

    // remove project projFolder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project projFolder
    (0, _fs.mkdirSync)(basePath);
  });

  it('createProj should create a config object with a unique id and project name', function () {
    projObj = utils.createProj(basePath, projectName);
    (0, _chai.expect)(projObj.projectName).to.equal(projectName);
    (0, _chai.expect)(projObj.uuid).to.be.a('string');
    (0, _chai.expect)(projObj.basePath).to.be.a('string');
    (0, _chai.expect)(projObj.basePath).to.equal(basePath);
  });

  it('createDockDev should create .dockdev projFolder when none exists', function () {
    result = utils.createDockDev(projObj);
    return result.then(function () {
      (0, _chai.expect)((0, _fs.readdirSync)((0, _path.join)(projObj.basePath, utils.config.projFolder))).to.be.empty;
    });
  });

  it('writeProj should write a specified object to the configFile', function () {
    return utils.writeProj(projObj).then(function () {
      return (0, _fs.readFileSync)((0, _path.join)(projObj.basePath, '.dockdev', 'dockdev.json'));
    }).then(_ramda2.default.toString).then(JSON.parse).then(function (data) {
      return (0, _chai.expect)(data).to.deep.equal(_ramda2.default.pick(utils.config.projWriteParams, projObj));
    });
  });

  it('addProjToMemory should add the config object to the apps memory object', function () {
    utils.addProjToMemory(utils.memory, projObj);
    (0, _chai.expect)(utils.memory[projObj.uuid]).to.equal(projObj);
  });

  it('createDockDev should fail when the projFolder already exists', function () {
    var tryAgain = utils.createDockDev(projObj);
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

    // remove project projFolder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project projFolder
    (0, _fs.mkdirSync)(basePath);
  });

  it('should create a projObj', function () {
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
        return (0, _chai.expect)(_ramda2.default.pick(utils.config.projWriteParams, orig)).to.deep.equal(data);
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

    // remove project projFolder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project projFolder
    (0, _fs.mkdirSync)(basePath);

    result = utils.initProject(basePath, projectName);
  });

  // this should probably be moved to the existing project tests (project2)
  it('readProj should read an existing config file returning an object', function () {
    return result.then(function (data) {
      return utils.readProj(data.basePath);
    }).then(function (data) {
      return result.then(function (orig) {
        return (0, _chai.expect)(data).to.deep.equal(orig);
      });
    });
  });
});

// describe('find our target files in specified directory', () => {
//
//
// })

describe('add and modify containers within a project', function () {
  var projectName = 'project4';
  var basePath = (0, _path.join)(__dirname, 'userFolder', projectName);
  var dockDevPath = (0, _path.join)(basePath, '.dockdev');
  var image = 'node';
  var result = void 0;
  var containerId = void 0;

  before(function () {
    // make sure there is a userFolder
    try {
      (0, _fs.mkdirSync)((0, _path.join)(__dirname, 'userFolder'));
    } catch (e) {}

    // remove project projFolder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project projFolder
    (0, _fs.mkdirSync)(basePath);

    result = utils.initProject(basePath, projectName);
  });

  it('should add a container to the project', function () {
    return result.then(function (data) {
      return utils.addContainer(data, image);
    }).then(function (id) {
      containerId = id;
      (0, _chai.expect)(containerId).to.not.equal(undefined);
      result.then(function (data) {
        (0, _chai.expect)(data.containers[containerId].image).to.equal(image);
        (0, _chai.expect)(data.containers[containerId].containerId).to.equal(containerId);
      });
    });
  });

  it('should delete a container from a project', function () {
    return result.then(function (data) {
      return utils.removeContainer(data, containerId);
    }).then(function (data) {
      (0, _chai.expect)(data).to.equal(true);
      (0, _chai.expect)(data.containers).to.be.empty;
    });
  });
});

describe('should sync files to docker machine', function () {
  var projectName = 'project5';
  var basePath = (0, _path.join)(__dirname, 'userFolder', projectName);
  var dockDevPath = (0, _path.join)(basePath, '.dockdev');
  var image = 'node';
  var result = void 0;
  var containerId = void 0;

  before(function () {
    // make sure there is a userFolder
    try {
      (0, _fs.mkdirSync)((0, _path.join)(__dirname, 'userFolder'));
    } catch (e) {}

    // remove project projFolder if it exists
    _rimraf2.default.sync(basePath);

    // add back the project projFolder
    (0, _fs.mkdirSync)(basePath);

    containerId = utils.initProject(basePath, projectName).then(function (data) {
      result = data;
      return utils.addContainer(data, image);
    });
  });

  it('should sync folder to docker-machine', function () {
    return containerId.then(function (id) {
      var syncFunc = rsync.generateRsync(result);
      (0, _fs.writeFileSync)((0, _path.join)(result.basePath, 'test.txt'));
      return syncFunc();
    });
  });

  it('should watch and sync files to the docker-machine', function (done) {
    return containerId.then(function (id) {
      (0, _fileWatch.addFileWatcher)(result);
      (0, _fs.writeFileSync)((0, _path.join)(result.basePath, 'test1.txt'));
      (0, _fs.writeFileSync)((0, _path.join)(result.basePath, 'test2.txt'));
      (0, _fs.writeFileSync)((0, _path.join)(result.basePath, 'test3.txt'));
      (0, _fs.writeFileSync)((0, _path.join)(result.basePath, 'test4.txt'));
      (0, _fs.writeFileSync)((0, _path.join)(result.basePath, 'test10.txt'));

      setTimeout(done, 10000);
      return;
    });
  });
});
