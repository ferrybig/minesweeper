'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var gutil = require('gulp-util');
var runSequence = require('run-sequence').use(gulp);

gulp.task('replace:production', function () {
	return gulp.src(['src/index.html'])
		.pipe(replace('@@cssfile', 'css/main.min.css'))
		.pipe(replace('@@jsfile', 'js/main.min.js'))
		.pipe(gulp.dest('public'));
});
gulp.task('replace:development', function () {
	return gulp.src(['src/index.html'])
		.pipe(replace('@@cssfile', 'css/main.css'))
		.pipe(replace('@@jsfile', 'js/main.js'))
		.pipe(gulp.dest('public'));
});
gulp.task('replace', function (cb) {
	if (gutil.env.env === 'production') {
		runSequence('replace:production', cb);
	} else {
		runSequence('replace:development', cb);
	}
});
