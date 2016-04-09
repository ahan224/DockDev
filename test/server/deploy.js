/*eslint-env mocha */
import { expect } from 'chai';
import { join } from 'path';
import * as rsync from '../../app/build/api/rsync.js';
import * as docker from '../../app/build/api/deploy.js';
import * as containerMgmt from '../../app/build/projLevel/containerMgmt';
import { removeMachine } from '../../app/build/api/machine.js';

const userFolder = join(__dirname, '..', 'userFolder');
const genBasePath = (projectName) => join(userFolder, projectName);

// this will test provisioning a droplet which takes significant time
// suggest that it remain pending unless specifically modifying the function
xdescribe('provision digitalocean droplet', function() {
  this.timeout(600000);
  const dropName = 'test';
  // need to add grab token from a specified file
  after(() => removeMachine('test'));

  it('should provision a default droplet', () =>
    createDroplet(dropName, DOtoken)
      .then(data => expect(data).to.be.a.string)
  );
});

// for speed this deploys to an already created local docker-machine
// you need to create a virtual box machine named 'test' for these to work
// you should also pull node, redis, and mongo
describe('deploy containers to test machine', () => {
  const machineName = 'test';
  const serverName = 'server1';
  const dbName = 'mongo1';

  const server = containerMgmt.setServerParams('node', serverName);
  const deb = containerMgmt.setDbParams('mongo', dbName);



});
