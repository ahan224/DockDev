const servers = [
  'node',
  'python',
  'go',
];

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

function ImageObj(name) {
  this.name = name;
  this.versions = [];
}

export function getServers() {
  return servers.map(val => new ImageObj(val));
}

export function getDbs() {
  return dbs.map(val => new ImageObj(val));
}

getServers();
