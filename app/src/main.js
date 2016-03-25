import electron from 'electron';
import { join } from 'path';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
// const ipcMain = electron.ipcMain;

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 750, height: 550, titleBarStyle: 'hidden-inset' });
  mainWindow.loadURL(join('file://', __dirname, 'index.html'));

  mainWindow.webContents.openDevTools();
  mainWindow.on('close', () => {
    mainWindow = null;
  });
});


// ipcMain.on('asynchronous-message', function(event, arg) {
//   console.log(arg);  // prints "ping"
//   event.sender.send('asynchronous-reply', 'pong');
// });
//
// ipcMain.on('synchronous-message', function(event, arg) {
//   console.log(arg);  // prints "ping"
//   event.returnValue = 'pong';
// });
