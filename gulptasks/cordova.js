'use strict';

(function () {

  module.exports = {
    init: RegisterTasks
  };

  function RegisterTasks(gulp) {

    var config = require('./cordova.config');
    var del = require('del');
    var path = require('path');
    var runSequence = require('run-sequence');
    var sh = require('shelljs');

    gulp.task('cordova.clean', function (done) {
      return del(config.target.root);
    });

    gulp.task('cordova.copy.web', function () {
      return gulp.src(path.join(config.source.web, '**', '*'))
        .pipe(gulp.dest(config.target.web));
    });

    gulp.task('cordova.copy.cordova', function () {
      return gulp.src(path.join(config.source.cordova, '**', '*'))
        .pipe(gulp.dest(config.target.root));
    });

    gulp.task('cordova.init', function (done) {
      runSequence(
        'cordova.clean',
        'cordova.copy.web',
        'cordova.copy.cordova',
        'cordova.prepare.all',
        done
      );
    });

    gulp.task('cordova.prepare.all', function (done) {
      var currentDir = sh.pwd();
      sh.cd(config.target.root);
      sh.exec('"../../node_modules/.bin/cordova" prepare');
      sh.cd(currentDir);
      done();
    });

    gulp.task('cordova.build.android', function (done) {
      var currentDir = sh.pwd();
      sh.cd(config.target.root);
      sh.exec('"../../node_modules/.bin/cordova" prepare android');
      sh.exec('"../../node_modules/.bin/cordova" compile android');
      sh.cd(currentDir);
      done();
    });

    gulp.task('cordova.emulate.android', function (done) {
      var currentDir = sh.pwd();
      sh.cd(config.target.root);
      sh.exec('"../../node_modules/.bin/cordova" prepare android');
      sh.exec('"../../node_modules/.bin/cordova" emulate android');
      sh.cd(currentDir);
      done();
    });

    gulp.task('cordova.build.windows', function (done) {
      var currentDir = sh.pwd();
      sh.cd(config.target.root);
      sh.exec('"../../node_modules/.bin/cordova" prepare windows');
      sh.exec('"../../node_modules/.bin/cordova" compile windows');
      sh.cd(currentDir);
      done();
    });

    gulp.task('cordova.emulate.windows', function (done) {
      var currentDir = sh.pwd();
      sh.cd(config.target.root);
      sh.exec('"../../node_modules/.bin/cordova" prepare windows');
      sh.exec('"../../node_modules/.bin/cordova" emulate windows');
      sh.cd(currentDir);
      done();
    });
  }
})();
