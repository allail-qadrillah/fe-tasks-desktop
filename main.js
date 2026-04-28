const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,         
      contextIsolation: false,       
      enableRemoteModule: true
    },
    // icon: path.join(__dirname, 'dist/assets/icons/icon.png'),
    show: false                      
  });

  // Load Angular build that has been compiled
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'dist/fe-tasks/browser/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Display the window once app is ready to show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});