'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('serve', function () {
	connect.server({
		port: 3002,
		root: 'public'
	});
	browserSync.init({
		proxy: 'http://localhost:3002/'
	});
	watch('public/**/*')
		.pipe(reload({stream: true}));
});
gulp.task('serve:reload:css', function () {
	return gulp.src("public/*.css")
        .pipe(browserSync.stream());
});

gulp.task('serve:reload:html', function () {
	return gulp.src("public/*.html")
        .pipe(browserSync.stream());
});
gulp.task('serve:reload:all', function () {
	return gulp.src("public/**/*")
        .pipe(browserSync.stream());
});
gulp.task('serve:reload:js', function () {
	return gulp.src("public/*.js")
        .pipe(browserSync.stream());
});
