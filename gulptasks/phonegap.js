'use strict';

(function () {

  module.exports = {
    init: RegisterTasks
  };

  function RegisterTasks(gulp) {

    var config = require('./phonegap.config');
    var del = require('del');
    var path = require('path');
    var runSequence = require('run-sequence');
    var zip = require('gulp-zip');

    gulp.task('phonegap.clean', function (done) {
      return del(config.target.root);
    });

    gulp.task('phonegap.copy.web', function () {
      return gulp.src(path.join(config.source.web, '**', '*'))
        .pipe(gulp.dest(config.target.root));
    });

    gulp.task('phonegap.copy.cordova', function () {
      return gulp.src(path.join(config.source.cordova, '**', '*'))
        .pipe(gulp.dest(config.target.root));
    });

    gulp.task('phonegap.zip', function () {
      return gulp.src(path.join(config.target.root, '**', '*'))
        .pipe(zip(config.target.zip))
        .pipe(gulp.dest(config.target.root));
    });

    gulp.task('phonegap.purge', function (done) {
      return del([
        path.join(config.target.root, '**', '*'),
        '!' + config.target.root,
        '!' + path.join(config.target.root, config.target.zip)
      ]);
    });

    gulp.task('phonegap', function (done) {
      runSequence(
        'phonegap.clean',
        'phonegap.copy.web',
        'phonegap.copy.cordova',
        'phonegap.zip',
        'phonegap.purge',
        done
      );
    });
  }
})();
