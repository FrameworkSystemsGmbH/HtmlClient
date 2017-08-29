'use strict';

module.exports = {
  source: {
    web: 'dist/web',
    electron: 'platforms/electron'
  },
  target: {
    root: 'dist/electron',
    cache: 'dist/electron/cache',
    web: 'dist/electron/web',
    version: 'v1.6.11'
  },
  resources: {
    iconWin: 'platforms/electron/icons/icon.ico',
    iconMac: 'platforms/electron/icons/icon.icns',
    iconPng: 'platforms/electron/icons/icon.png'
  }
};
