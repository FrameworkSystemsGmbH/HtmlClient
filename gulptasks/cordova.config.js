'use strict';

module.exports = {
  source: {
    web: 'dist/web',
    cordova: 'platforms/cordova'
  },
  target: {
    root: 'dist/cordova',
    web: 'dist/cordova/www'
  },
  inject: {
    js: [
      'cordova.js'
    ]
  }
};
