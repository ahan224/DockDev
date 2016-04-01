// list of available server images for the user
export const servers = [
  'node',
  'python',
  'go',
];

// list of available database images for the user
const dbs = [
  'redis',
  'mysql',
  'mongo',
  'postgres',
  'elasticsearch',
  'mariadb',
  'memcached',
  'neo4j',
  'rethinkdb',
  'cassandra',
  'couchbase',
];

/**
* @param {Object} ImageObj has the name of the image and it's available versions
*/
function ImageObj(name) {
  this.name = name;
  this.versions = [];
}

/**
 * getServers() returns a new Array of server image objects (ImageObj)
 * based on the servers array
 *
 * @return {Array} returns an Array of server image objects
 */
export function getServers() {
  return servers.map(val => new ImageObj(val));
}

/**
 * getDbs() returns a new Array of databse image objects (ImageObj)
 * based on the databases (dbs) array
 *
 * @return {Array} returns an Array of database image objects
 */
export function getDbs() {
  return dbs.map(val => new ImageObj(val));
}

// getServers();
