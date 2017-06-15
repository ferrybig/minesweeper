'use strict';

var gulp = require('gulp');
var pump = require('pump');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-babili');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var ignore = require('gulp-ignore');
var clean = require('gulp-clean');

gulp.task('javascript', function (cb) {
	pump([gulp.src([
			'src/js/vendor/**/*.js',
			'src/js/modules/**/*.js',
			'src/js/*.js'
		]),
		ignore.exclude('main.*'),
		sourcemaps.init(),
		babel(),
		concat('main.js'),
		sourcemaps.write('.'),
		gulp.dest('public/js'),
		ignore.exclude('*.map'),
		uglify(),
		rename('main.min.js'),
		gulp.dest('public/js')
	], cb);
});

