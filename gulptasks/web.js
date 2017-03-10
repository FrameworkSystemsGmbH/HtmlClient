'use strict';

(function () {

  module.exports = {
    init: RegisterTasks
  };

  function RegisterTasks(gulp) {

    var config = require('./web.config'),
      del = require('del'),
      runSequence = require('run-sequence');

    gulp.task('web.purge', function () {
      return del(config.source.folders.app + '/**/*.gz');
    });

    gulp.task('web', function (done) {
      return runSequence(
        'web.purge',
        done
      );
    });
  }
})();
