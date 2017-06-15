'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);

gulp.task('default', function (cb) {
	runSequence('build', 'serve', 'watch', cb);
});
