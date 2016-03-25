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

export function getServers() {
  return servers;
}

export function getDbs() {
  return dbs;
}
