'use strict';

(function () {
  var gulp = require('gulp');
  var electronTasks = require('./gulptasks/electron');
  var cordovaTasks = require('./gulptasks/cordova');

  electronTasks.init(gulp);
  cordovaTasks.init(gulp);
})();
