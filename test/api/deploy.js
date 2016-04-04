/*eslint-env mocha */
import { expect } from 'chai';
import { join } from 'path';
import * as rsync from '../../app/build/api/rsync.js';
import { removeContainer, addContainer } from '../../app/build/api/docker.js';
import { createDroplet } from '../../app/build/api/deploy.js';
import { removeMachine } from '../../app/build/api/machine.js';

const userFolder = join(__dirname, '..', 'userFolder');
const genBasePath = (projectName) => join(userFolder, projectName);
const DOtoken = '7b383cd4a9c6eff4bad70264a015bd5d3f9a21bfd690a2a18f80ff6dea717592';

// this will test provisioning a droplet which takes significant time
// suggest that it remain pending unless specifically modifying the function
xdescribe('provision digitalocean droplet', function() {
  this.timeout(600000);
  const dropName = 'test';

  after(() => removeMachine('test'));

  it('should provision a default droplet', () =>
    createDroplet(dropName, DOtoken)
      .then(data => expect(data).to.be.a.string)
  );
});

// for speed this deploys to an already created local docker-machine
// you need to create a virtual box machine named 'test' for these to work
// you should also pull node, redis, and mongo
describe('deploy a project to digital ocean', () => {
  const machineName = 'test';
  const dbName = 'mongo1';

  before((() => {

  })
});
