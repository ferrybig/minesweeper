'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var sassLint = require('gulp-sass-lint');
var jshint = require('gulp-jshint');
var ignore = require('gulp-ignore');
var notify = require("gulp-notify");
var notifier = require('node-notifier');
var cache = require('gulp-cached');


gulp.task('lint', function (cb) {
	runSequence(['lint:scss', 'lint:javascript', 'lint:gulp'], cb);
});

gulp.task('lint:scss', function () {
	var myCustomReporter = function(file) {
		sassLint.defaultReporter(file);
		if (file.scsslint.issues.length !== 0) {
			notifier.notify({ 
				title: file.path, 
				message: file.scsslint.issues.length + ' issues found'
			});
		}
	};
	
	return gulp.src('src/sass/**/*.scss')
    .pipe(cache('scsslint'))
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(sassLint({
		'files': {
			'ignore': 'src/sass/vendors/*.scss'
		},
		'rules': {
			'no-css-comments': 0,
			'property-sort-order': 0,
			'force-pseudo-nesting': 0,
			'hex-length': 0,
			'hex-notation': [2,
				{'style': 'uppercase'}],
			'indentation': [1,
				{'size': 'tab'}],
			'empty-line-between-blocks': 0,
			'leading-zero': 0,
			'no-ids': 0
		},
		customReport: myCustomReporter
	}))

	.pipe(sassLint.format())
	.pipe(sassLint.failOnError());
});

gulp.task('lint:javascript', function () {
	return gulp.src([
		'src/js/modules/**/*.js',
		'src/js/*.js'
	])
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(ignore.exclude('main.*'))
	.pipe(jshint({
		indent: 'tab',
		nonstandard: true,
		globalstrict: true,
		devel: true,
		esversion: 6,
		globals: {
			console: true,
			alert: true,
			window: true,
			document: true,
			confirm: true,
			prompt: true,
			Math: true
		}
	}))
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(jshint.reporter('fail'));
});

gulp.task('lint:gulp', function () {
	return gulp.src([
		'gulp/**/*.js',
		'gulpfile.js'
	])
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(ignore.exclude('main.*'))
	.pipe(jshint({
		indent: 'tab',
		nonstandard: true,
		globalstrict: true,
		devel: true,
		node: true,
		globals: {
			console: true
		}
	}))
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(jshint.reporter('fail'));
});
