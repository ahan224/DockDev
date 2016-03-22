'use strict';
'use-strict';

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = _electron2.default.app;
// import * as utils from './lib/utils.js';

const BrowserWindow = _electron2.default.BrowserWindow;
const ipcMain = _electron2.default.ipcMain;

let mainWindow = null;

app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 750, height: 550, titleBarStyle: "hidden-inset" });
  mainWindow.loadURL('file://' + (0, _path.join)(__dirname, 'index.html'));

  // utils.readConfig(process.env.HOME)
  //   .catch(console.log);

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
;
// const fs = require('fs');
// const path = require('path');
// const utils = require('../lib/utils.js');
// const remote = require('remote');
// const dialog = remote.require('dialog')
// const dialog = electron.dialog;

// global.ipcRenderer = require('electron').ipcRenderer;