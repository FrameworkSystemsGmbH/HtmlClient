'use strict';

(function () {
  var gulp = require('gulp');
  var webTasks = require('./gulptasks/web');
  var electronTasks = require('./gulptasks/electron');
  var cordovaTasks = require('./gulptasks/cordova');

  webTasks.init(gulp);
  electronTasks.init(gulp);
  cordovaTasks.init(gulp);
})();
