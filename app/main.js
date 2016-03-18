'use strict';
'use-strict';

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

var _utils = require('./lib/utils.js');

var utils = _interopRequireWildcard(_utils);

var _path = require('path');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _electron2.default.app;
const BrowserWindow = _electron2.default.BrowserWindow;
const ipcMain = _electron2.default.ipcMain;
const dialog = _electron2.default.dialog;

let mainWindow = null;

app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 750, height: 550, titleBarStyle: "hidden-inset" });
  mainWindow.loadURL('file://' + (0, _path.join)(__dirname, 'index.html'));

  utils.readConfig(process.env.HOME).catch(console.log);

  mainWindow.webContents.openDevTools();
  mainWindow.on('close', function () {
    mainWindow = null;
  });
});

ipcMain.on('asynchronous-message', function (event, arg) {
  console.log(arg); // prints "ping"

  event.sender.send('asynchronous-reply', 'pong');
});

ipcMain.on('synchronous-message', function (event, arg) {
  console.log(arg); // prints "ping"
  event.returnValue = 'pong';
});

// const ipcRenderer = require('electron').ipcRenderer;
// const sweetAlert = require('sweetalert2');
// const remote = require('remote');
// const dialog = remote.require('dialog');
// const fs = require('fs');
// const path = require('path');
// const utils = require('../lib/utils.js');

// global.ipcRenderer = require('electron').ipcRenderer;
