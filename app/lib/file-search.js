
// const spawn = Promise.promisify(child_process.spawn);

// const find = cmdLineSpawn('find');
//
// const findDockdev = folder_name => {
//   return find(`-name ${ folder_name }`);
// }

// .then(console.log)
// .catch(console.log);
//.stdout.on('data', data => console.log(data.toString()));

// const findDockdev = (base_folder, target) => {
//   return new Promise((resolve, reject) => {
//     let result = '';
//     const tmp = spawn('find', [base_folder, '-name', target])
//     tmp.stdout.on('data', data => result += data);
//     tmp.stderr.on('data', data => reject(data.toString()));
//     tmp.on('close', () => resolve(result));
//   })
//
// }

// 'use strict'
// // why?
// // window.$ = window.jQuery = require('./node_modules/jquery/dist/jquery.js');
// const fs = require('fs');
// const path = require('path');
//
// const walk = (baseFolder, search, exclude, done) => {
//   let results = [];
//   fs.readdir(baseFolder, (err, list) => {
//     if (err) return done(err);
//
//     list = list.filter(listItem => {
//       return !exclude[listItem];
//     });
//
//     if (list.indexOf(search.value) !== -1) {
//       results.push(path.resolve(baseFolder, search.value));
//       return results;
//     }
//
//     let pending = list.length;
//     if (!pending) return done(null, results);
//
//     list.forEach(file => {
//       let filePath = path.resolve(baseFolder, file);
//
//       fs.stat(filePath, (err, stat) => {
//         if (stat && stat.isDirectory()) {
//
//           walk(filePath, search, exclude, (err, res) => {
//             results = results.concat(res);
//             if (!--pending) done(null, results);
//           });
//         }
//           if (!--pending) done(null, results);
//       });
//     });
//   });
// };
//
//
// let searchParam = {
//   value: "index.html",
//   folder: false
// };
//
// let excludeParam = {
//   ".git": true,
//   ".gitignore": true
// };
//
// walk(process.env.HOME, searchParam, excludeParam, function(err, results) {
//   if (err) throw err;
//   console.log(results);
// });
//
//
//
// var fileTree = [];
//
// function getFilesRecursive (folder, search, exclude, done) {
//     var stats;
//     var fileContents = fs.readdir(folder, done),
//
//     fileContents.forEach(function (fileName) {
//         if (!exclude.hasOwnProperty(fileName)) {
//           stats = fs.lstat(folder + '/' + fileName);
//         if (stats.isDirectory()) {
//           if (fileName.indexOf(search.value) && search.folder) {
//             fileTree.push(folder + '/' + fileName);
//           }
//           getFilesRecursive(folder + '/' + fileName, search, exclude);
//         } else {
//           if (fileName.indexOf(search.value) > -1 && !(search.folder)) {
//             fileTree.push(folder + '/' + fileName);
//           }
//         }
//       }
//     });
//
//     return fileTree;
// };
//
// console.log(getFilesRecursive(path.join(__dirname, "./../../../unit-project-api"), searchParam, excludeParam, function(err, results) {
//   if (err) throw err;
//   console.log(results);
// }));
//
// console.log(__dirname);
"use strict";