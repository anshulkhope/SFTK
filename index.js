const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');
const sev = require('./lib/sevent');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true
        },
        frame: false,
        maximizable: false,
        icon: path.join(__dirname, 'assets/icons/icon.png')
    });
    mainWindow.loadFile('src/index.html');
    mainWindow.setMenu(null);
    mainWindow.flashFrame(true);
    sev.handleEvents(ipcMain, app, mainWindow);
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
