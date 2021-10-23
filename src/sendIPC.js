const $ = require('jquery');
const { ipcRenderer } = require('electron');

$('#close-w').on('click', function() {
    ipcRenderer.send('closed', true);
});
$('#minimz-w').on('click', function() {
    ipcRenderer.send('minimized', true);
});
$('#slideDo').on('click', function() {
    handleDB();
});