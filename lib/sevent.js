function handleEvents(ipcMain, app, window) {
    ipcMain.on('closed', (event, args) => {
        if (args === true) {
            app.quit();
        }
    });
    ipcMain.on('minimized', (event, args) => {
        if (args === true) {
            window.minimize();
        }
    });
}

module.exports = { handleEvents };