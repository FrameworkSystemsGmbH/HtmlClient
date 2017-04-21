'use strict';

let isLiveReload = process.argv[2] === '--livereload';

const path = require('path');
const electron = require('electron');
const { app, globalShortcut, BrowserWindow, Menu, shell } = electron;


let client;
let mainWindow;
let trayApp;

if (isLiveReload) {
    client = require('electron-connect').client;
}

app.on('window-all-closed', () => {
    //https://github.com/atom/electron/issues/2312
    app.quit();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        title: 'HTML Client',
        width: 1024,
        minWidth: 800,
        height: 768,
        minHeight: 600,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true
        }
    });

    buildTrayIcon();

    globalShortcut.register('CmdOrCtrl+Shift+d', function () {
        mainWindow.webContents.toggleDevTools();
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.setTitle(app.getName());

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (client) {
        client.create(mainWindow);
    }

    if (process.platform == 'darwin') {
        buildNativeAppMenu();
    }
});

let buildNativeAppMenu = () => {
    var template = [{
        label: "Application",
        submenu: [
            {
                label: "About Application", selector: "orderFrontStandardAboutPanel:"
            },
            {
                type: "separator"
            },
            {
                label: "Reload", accelerator: "CmdOrCtrl+R",
                click: () => {
                    mainWindow.loadURL('file://' + __dirname + '/index.html');
                }
            },
            {
                label: "Quit", accelerator: "Command+Q",
                click: () => {
                    app.quit();
                }
            }
        ]
    }, {
        label: "Edit",
        submenu: [
            {
                label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"
            },
            {
                label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"
            },
            {
                type: "separator"
            },
            {
                label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"
            },
            {
                label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"
            },
            {
                label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"
            },
            {
                label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:"
            }
        ]
    }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

let buildTrayIcon = () => {
    let trayIconPath = path.join(__dirname, 'icon.png');

    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            role: 'quit'
        }
    ]);

    trayApp = new electron.Tray(trayIconPath);
    trayApp.setToolTip('HTML Client');
    trayApp.setContextMenu(contextMenu);
};