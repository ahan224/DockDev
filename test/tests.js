import { expect } from 'chai';
import * as utils from '../app/lib/utils.js';
import { join } from 'path';
import rimraf from 'rimraf';

describe('initiate new DockDev folder', () => {
  var path = join(__dirname, 'userFolder', 'project1');
  var dockDevPath = join(path, '.dockdev');

  // remove .dockdev folder -- this is for testing only
  before(() => rimraf.sync(dockDevPath));

  it('createDockDev should create .dockdev folder without error', () => {
    var result = utils.createDockDev(path);
    return result.then(data => expect(data).to.equal(dockDevPath));
  });

  // it('addJson should add a dockdev.json file', () => {
  //
  // })

});
