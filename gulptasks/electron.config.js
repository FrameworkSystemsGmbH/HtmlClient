'use strict';

module.exports = {
  source: {
    web: 'dist/web',
    electron: 'electron'
  },
  target: {
    root: 'dist/electron',
    cache: 'dist/electron/cache',
    web: 'dist/electron/web',
    version: 'v1.6.11'
  },
  resources: {
    iconWin: 'electron/icons/icon.ico',
    iconMac: 'electron/icons/icon.icns',
    iconPng: 'electron/icons/icon.png'
  }
};
