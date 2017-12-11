const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// Electron reload
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

// Global window instance
let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 500, height: 400,
        show: false, title: ''
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views', 'index.html'),
        protocol: 'file:', slashes: true
    }));

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// App listeners
app.on('ready', createMainWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow();
    }
});