import fs from 'fs';
import childProcess from 'child_process';
import Promise from 'bluebird';

// promisify certain callback functions
export const mkdir = Promise.promisify(fs.mkdir);
export const writeFile = Promise.promisify(fs.writeFile);
export const readFile = Promise.promisify(fs.readFile);
export const exec = Promise.promisify(childProcess.exec);

/**
 * find() returns an array of data using the 'find' terminal command
 * based on the passed in array of options for the 'find' terminal command
 *
 * @param {Array} array
 * @return {Array} 'find' results array
 */
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

/**
 * jsonStringifyPretty() returns a string (JSON.stringify) with indent formatting
 * based on the passed in object
 *
 * @param {Object} obj
 * @return {String}
 */
export const jsonStringifyPretty = (obj) => JSON.stringify(obj, null, 2);
