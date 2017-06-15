'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var pump = require('pump');
var clean = require('gulp-clean');

gulp.task('clean', function (cb) {
	runSequence('clean:all', cb);
});
gulp.task('clean:production', function (cb) {
	pump([gulp.src([
			'public/main.js',
			'public/main.js.map',
			'public/main.css',
			'public/main.css.map'
		]),
		clean()
	], cb);
});
gulp.task('clean:javascript', function (cb) {
	pump([gulp.src([
			'public/main.js',
			'public/main.js.map',
			'public/main.min.js'
		]),
		clean()
	], cb);
});
gulp.task('clean:styles', function (cb) {
	pump([gulp.src([
			'public/main.css',
			'public/main.css.map',
			'public/main.min.css'
		]),
		clean()
	], cb);
});
gulp.task('clean:all', function (cb) {
	pump([gulp.src([
			'public/*'
		]),
		clean()
	], cb);
});
