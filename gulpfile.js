'use strict';

(function () {
  var gulp = require('gulp');
  var electronTasks = require('./gulptasks/electron');
  var phonegapTasks = require('./gulptasks/phonegap');
  var cordovaTasks = require('./gulptasks/cordova');

  electronTasks.init(gulp);
  phonegapTasks.init(gulp);
  cordovaTasks.init(gulp);
})();
