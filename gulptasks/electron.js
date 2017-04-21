'use strict';

(function () {

  module.exports = {
    init: RegisterTasks
  };

  function RegisterTasks(gulp) {

    var config = require('./electron.config');
    var pkgJson = require('../package.json');
    var del = require('del');
    var fs = require('fs');
    var electron = require('gulp-electron');
    var path = require('path');
    var runSequence = require('run-sequence');

    gulp.task('electron.clean', function (done) {
      return del([
        path.join(config.target.root, '**', '*'),
        '!' + config.target.cache,
        '!' + path.join(config.target.cache, '**', '*')
      ]);
    });

    gulp.task('electron.copy.web', function () {
      return gulp.src(path.join(config.source.web, '**', '*'))
        .pipe(gulp.dest(path.join(config.target.web)));
    });

    gulp.task('electron.copy.electron', function () {
      return gulp.src(path.join(config.source.electron, '**', '*'))
        .pipe(gulp.dest(path.join(config.target.web)));
    });

    gulp.task('electron.copy.resources', function () {
      return gulp.src(config.resources.iconPng)
        .pipe(gulp.dest(path.join(config.target.web)));
    });

    gulp.task('electron.pack', function () {
      var elecPkgJson = {
        name: pkgJson.name,
        version: pkgJson.version,
        main: 'index.js'
      };

      fs.writeFileSync(path.join(config.target.web, 'package.json'), JSON.stringify(elecPkgJson, null, 4));

      return gulp.src('')
        .pipe(electron({
          src: config.target.web,
          packageJson: './package.json',
          release: config.target.root,
          cache: config.target.cache,
          version: config.target.version,
          asar: false,
          packaging: false,
          platforms: ['win32-x64', 'linux-x64', 'darwin-x64'],
          platformResources: {
            darwin: {
              CFBundleDisplayName: pkgJson.name,
              CFBundleIdentifier: pkgJson.name,
              CFBundleName: pkgJson.name,
              CFBundleVersion: pkgJson.version,
              icon: config.resources.iconMac
            },
            win: {
              "version-string": pkgJson.name,
              "file-version": pkgJson.version,
              "product-version": pkgJson.version,
              "icon": config.resources.iconWin
            }
          }
        }));
    });

    gulp.task('electron.purge', function () {
      return del(config.target.web);
    });

    gulp.task('electron', function (done) {
      runSequence(
        'electron.clean',
        'electron.copy.web',
        'electron.copy.electron',
        'electron.copy.resources',
        'electron.pack',
        'electron.purge',
        done
      );
    });
  }
})();
