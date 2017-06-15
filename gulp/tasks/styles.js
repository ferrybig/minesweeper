'use strict';

var gulp = require('gulp');
var pump = require('pump');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var ignore = require('gulp-ignore');

gulp.task('styles', function (cb) {
	pump([gulp.src('src/sass/style.scss'),
		sourcemaps.init(),
		sass(),
		autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}),
		rename('main.css'),
		sourcemaps.write('.'),
		gulp.dest('public/css'),
		ignore.exclude('*.map'),
		cleancss({
			level: {
				2: {
					all: true
				}
			}
		}),
		rename('main.min.css'),
		gulp.dest('public/css')
	], cb);
});

