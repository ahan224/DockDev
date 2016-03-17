'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

global.ipcRenderer = require('electron').ipcRenderer;

var mainWindow = null;

app.on('ready', function(){
  mainWindow = new BrowserWindow({width:750,height:550, titleBarStyle: "hidden-inset"});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.openDevTools();
  mainWindow.on('close', function () {
    mainWindow = null;
  });
});
