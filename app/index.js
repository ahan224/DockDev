'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
global.ipcRenderer = require('electron').ipcRenderer;

var mainWindow = null;
// require('bootstrap');

app.on('ready', function(){
  mainWindow = new BrowserWindow({width:750,height:550});
  // window.$ = window.jQuery = require('node_modules/jquery/dist/jquery.js');
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.openDevTools();
  mainWindow.on('close', function () {
    mainWindow = null;
  });
});
