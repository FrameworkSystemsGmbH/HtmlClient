'use strict';

module.exports = {
  source: {
    web: 'dist/web',
    config: 'cordova/config.xml',
    hooks: 'cordova/hooks'
  },
  target: {
    root: 'dist/cordova',
    hooks: 'dist/cordova/hooks',
    web: 'dist/cordova/www'
  },
  resources: {
    iconPng: 'resources/icon.png'
  }
};
