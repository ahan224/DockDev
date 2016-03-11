import { expect } from 'chai';
import * as utils from '../app/lib/utils.js';
import { join } from 'path';
import rimraf from 'rimraf';
import { readFileSync } from 'fs';
import R from 'ramda';

describe('initiate new DockDev project', () => {
  var path = join(__dirname, 'userFolder', 'project1');
  var dockDevPath = join(path, '.dockdev');
  var result;
  var configObj;

  // remove .dockdev folder -- this is for testing only
  before(() => rimraf.sync(dockDevPath));

  it('createDockDev should create .dockdev folder when none exists', () => {
    result = utils.createDockDev(path);
    return result.then(data => expect(data).to.equal(dockDevPath));
  });

  it('createDockDev should fail when the folder already exists', () => {
    var tryAgain = utils.createDockDev(path);
    return tryAgain
      .then(
          data => expect(data).to.equal(undefined),
          err => expect(err.code).to.equal('EEXIST')
        )
      // .catch(err => expect(err.code).to.equal('EEXIST'))
  })

  it('createConfig should create a config object with a unique id and project name', () => {
    configObj = utils.createConfig('project1');
    expect(configObj.projectName).to.equal('project1');
    expect(configObj.uuid).to.be.a('string');
  })

  it('writeConfig should write a specified object to the configFile', () => {
    return result
      .then(utils.writeConfig(configObj))
      .then(readFileSync)
      .then(R.toString)
      .then(JSON.parse)
      .then(data => expect(data).to.deep.equal(configObj));
  })

  // this should probably be moved to the existing project tests (project2)
  it('readConfig should read an existing config file returning an object', () => {
    return result
      .then(utils.readConfig)
      .then(data => expect(data).to.deep.equal(configObj))
  })

});
