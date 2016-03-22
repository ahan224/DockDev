import fs from 'fs';
import childProcess from 'child_process';
import Promise from 'bluebird';

// promisify certain callback functions
export const mkdir = Promise.promisify(fs.mkdir);
export const writeFile = Promise.promisify(fs.writeFile);
export const readFile = Promise.promisify(fs.readFile);
export const exec = Promise.promisify(childProcess.exec);

export const find = (array) => {
  let result = '';
  const spawnFind = childProcess.spawn('find', array);

  spawnFind.stdout.on('data', data => {result += data;});

  return new Promise((resolve, reject) => {
    spawnFind.stderr.on('data', reject);
    spawnFind.stdout.on('close', () => {
      resolve(result.split('\n').slice(0, -1));
    });
  });
};

// jsonStringifyPretty :: object -> string
// predefines JSON stringify with formatting
export const jsonStringifyPretty = (obj) => JSON.stringify(obj, null, 2);
