'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence').use(gulp);

gulp.task('build:development', function (cb) {
	runSequence('lint', 'clean', ['javascript', 'styles', 'replace:development', 'copy'], cb);
});
gulp.task('build:production', function (cb) {
	runSequence('lint', 'clean', ['javascript', 'styles', 'replace:production', 'copy'], 'clean:production', cb);
});
gulp.task('build', function (cb) {
	if(gutil.env.env === 'production') {
		runSequence('build:production', cb);
	} else {
		runSequence('build:development', cb);
	}
});
