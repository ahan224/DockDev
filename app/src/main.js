import electron from 'electron';
import { join } from 'path';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
// const ipcMain = electron.ipcMain;

let mainWindow = null;

// electron is listening for when the app is 'ready' to load and will create a new browser window
app.on('ready', () => {

  mainWindow = new BrowserWindow({ width: 950, height: 650 });
  mainWindow.loadURL(join('file://', __dirname, 'index.html'));

  mainWindow.webContents.openDevTools();
  mainWindow.on('close', () => {
    mainWindow = null;
  });
});
