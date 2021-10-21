const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sev = require('./lib/sevent');

function main() {
    const mainWindow = new BrowserWindow({
        title: 'SFTK',
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

app.on('ready', main);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});