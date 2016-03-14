import { expect } from 'chai';
import * as utils from '../app/lib/utils.js';
import { join } from 'path';
import rimraf from 'rimraf';
import { readFileSync, mkdirSync } from 'fs';
import R from 'ramda';

describe('initiate new DockDev project via individual functions', () => {
  const projectName = 'project1'
  const basePath = join(__dirname, 'userFolder', projectName);
  const dockDevPath = join(basePath, '.dockdev');
  let result;
  let configObj;

  before(() => {
    // make sure there is a userFolder
    try { mkdirSync(join(__dirname, 'userFolder')) }
    catch (e) {}

    // remove project folder if it exists
    rimraf.sync(basePath);

    // add back the project folder
    mkdirSync(basePath);
  });

  it('createConfig should create a config object with a unique id and project name', () => {
    configObj = utils.createConfig(basePath, projectName);
    expect(configObj.projectName).to.equal('project1');
    expect(configObj.uuid).to.be.a('string');
    expect(configObj.basePath).to.be.a('string');
  })

  it('createDockDev should create .dockdev folder when none exists', () => {
    result = utils.createDockDev(configObj);
    return result.then(data => expect(data).to.equal(configObj));
  });

  it('writeConfig should write a specified object to the configFile', () => {
    return result
      .then(utils.writeConfig)
      .then(data => readFileSync(join(data.basePath, '.dockdev', 'dockdev.json')))
      .then(R.toString)
      .then(JSON.parse)
      .then(data => expect(data).to.deep.equal(R.pick(utils.configWriteParams, configObj)));
  })

  it('addConfigToMemory should add the config object to the apps memory object', () => {
    utils.addConfigToMemory(utils.memory, configObj);
    expect(utils.memory[configObj.uuid]).to.equal(configObj);
  })

  it('createDockDev should fail when the folder already exists', () => {
    const tryAgain = utils.createDockDev(configObj);
    return tryAgain
    .then(
      data => expect(data).to.equal(undefined),
      err => expect(err.code).to.equal('EEXIST')
    )
  })
});

describe('initiate new DockDev project via initiateProject', () => {
  const projectName = 'project2'
  const basePath = join(__dirname, 'userFolder', projectName);
  const dockDevPath = join(basePath, '.dockdev');
  let result;

  before(() => {
    // make sure there is a userFolder
    try { mkdirSync(join(__dirname, 'userFolder')) }
    catch (e) {}

    // remove project folder if it exists
    rimraf.sync(basePath);

    // add back the project folder
    mkdirSync(basePath);
  });

  it('should create a configObj', () => {
    result = utils.initProject(basePath, projectName);
    return result
      .then(data => {
        expect(data).to.be.an('object');
        expect(data.uuid).to.be.a('string');
        expect(data.projectName).to.equal(projectName);
        expect(data.basePath).to.equal(basePath);
      });
  })

  it('should write the config file to dockdev.json', () => {
    return result
      .then(data => readFileSync(join(basePath, '.dockdev', 'dockdev.json')))
      .then(R.toString)
      .then(JSON.parse)
      .then(data => result.then(orig => expect(R.pick(utils.configWriteParams, orig)).to.deep.equal(data)))
  })

  it('should add the config to app memory', () => {
    return result
      .then(data => expect(data).to.equal(utils.memory[data.uuid]))
  })

  it('should fail if a project already exists', () => {
    return utils.initProject(basePath, projectName)
      .then(data => expect(data).to.be(undefined))
      .catch(err => expect(err.code).to.equal('EEXIST'))
  })

})

describe('read and modify an existing project', () => {
  const projectName = 'project3'
  const basePath = join(__dirname, 'userFolder', projectName);
  const dockDevPath = join(basePath, '.dockdev');
  let result;

  before(() => {
    // make sure there is a userFolder
    try { mkdirSync(join(__dirname, 'userFolder')) }
    catch (e) {}

    // remove project folder if it exists
    rimraf.sync(basePath);

    // add back the project folder
    mkdirSync(basePath);

    result = utils.initiateProject(basePath, projectName);
  });

  // this should probably be moved to the existing project tests (project2)
  it('readConfig should read an existing config file returning an object', () => {
    return result
    .then(data => utils.readConfig(data.basePath))
    .then(data => result.then(orig => expect(data).to.deep.equal(orig)))
  })

})
