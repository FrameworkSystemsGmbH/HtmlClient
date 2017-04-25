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

    gulp.task('cordova.copy.config', function () {
      gulp.src(config.source.config)
        .pipe(gulp.dest(config.target.root));
    });

    gulp.task('cordova.copy.hooks', function () {
      return gulp.src(path.join(config.source.hooks, '**', '*'))
        .pipe(gulp.dest(config.target.hooks));
    });

    gulp.task('cordova.copy.web', function () {
      return gulp.src(path.join(config.source.web, '**', '*'))
        .pipe(gulp.dest(config.target.web));
    });

    gulp.task('cordova.copy.resources', function () {
      return gulp.src(config.resources.iconPng)
        .pipe(gulp.dest(config.target.root));
    });

    gulp.task('cordova.android', function (done) {
      var currentDir = sh.pwd();
      sh.cd(config.target.root);
      sh.exec('"../../node_modules/.bin/cordova" platform add android');
      sh.exec('"../../node_modules/.bin/cordova" prepare android');
      sh.exec('"../../node_modules/.bin/cordova" build android');
      sh.cd(currentDir);
      done();
    });

    gulp.task('cordova.ios', function (done) {
      var currentDir = sh.pwd();
      sh.cd(config.target.root);
      sh.exec('"../../node_modules/.bin/cordova" platform add ios');
      sh.exec('"../../node_modules/.bin/cordova" prepare ios');
      sh.exec('"../../node_modules/.bin/cordova" build ios');
      sh.cd(currentDir);
      done();
    });

    gulp.task('cordova.build.android', function (done) {
      runSequence(
        'cordova.clean',
        'cordova.copy.config',
        'cordova.copy.hooks',
        'cordova.copy.web',
        'cordova.copy.resources',
        'cordova.android',
        done
      );
    });

    gulp.task('cordova.build.ios', function (done) {
      runSequence(
        'cordova.clean',
        'cordova.copy.config',
        'cordova.copy.hooks',
        'cordova.copy.web',
        'cordova.copy.resources',
        'cordova.ios',
        done
      );
    });

    gulp.task('cordova.emulate.android', function (done) {
      var currentDir = sh.pwd();
      sh.cd(config.target.root);
      sh.exec('"../../node_modules/.bin/cordova" emulate --target="Nexus_6_API_25" android');
      sh.cd(currentDir);
      done();
    });

    gulp.task('cordova.emulate.ios', function (done) {
      var currentDir = sh.pwd();
      sh.cd(config.target.root);
      sh.exec('"../../node_modules/.bin/cordova" emulate ios');
      sh.cd(currentDir);
      done();
    });
  }
})();
