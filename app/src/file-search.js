var fs = require('fs');
var path = require('path');
window.$ = window.jQuery = require('./node_modules/jquery/dist/jquery.js');


var fileTree = [];

function getFilesRecursive (folder, search, exclude) {
    var fileContents = fs.readdirSync(folder),
        stats;

    fileContents.forEach(function (fileName) {
        if (!exclude.hasOwnProperty(fileName)) {
          stats = fs.lstatSync(folder + '/' + fileName);
        if (stats.isDirectory()) {
          if (fileName.indexOf(search.value) && search.folder) {
            fileTree.push(folder + '/' + fileName);
          }
          getFilesRecursive(folder + '/' + fileName, search, exclude);
        } else {
          if (fileName.indexOf(search.value) > -1 && !(search.folder)) {
            fileTree.push(folder + '/' + fileName);
          }
        }
      }
    });

    return fileTree;
};

var searchParam = {
  value: "index",
  folder: false
};

var excludeParam = {
  ".git": true,
  ".gitignore": true
}

console.log(getFilesRecursive(path.join(__dirname, "./../unit-project-api"), searchParam, excludeParam));

console.log(__dirname);
