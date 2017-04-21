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
    version: 'v1.6.5'
  },
  resources: {
    iconWin: 'resources/icon.ico',
    iconMac: 'resources/icon.icns',
    iconPng: 'resources/icon.png'
  }
};
