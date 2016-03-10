'use strict';

var _chai = require('chai');

var _utils = require('../app/lib/utils.js');

var utils = _interopRequireWildcard(_utils);

var _path = require('path');

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('initiate new DockDev folder', () => {
  var path = (0, _path.join)(__dirname, 'userFolder', 'project1');
  var dockDevPath = (0, _path.join)(path, '.dockdev');

  // remove .dockdev folder -- this is for testing only
  before(() => _rimraf2.default.sync(dockDevPath));

  it('createDockDev should create .dockdev folder without error', () => {
    var result = utils.createDockDev(path);
    return result.then(data => (0, _chai.expect)(data).to.equal(dockDevPath));
  });

  // it('addJson should add a dockdev.json file', () => {
  //
  // })
});
