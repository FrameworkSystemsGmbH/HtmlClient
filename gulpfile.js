'use strict';

(function () {
  var gulp = require('gulp'),
    webTasks = require('./gulptasks/web');

  webTasks.init(gulp);
})();
