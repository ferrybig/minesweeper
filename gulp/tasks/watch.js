'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence').use(gulp);

gulp.task('watch', function () {
	gulp.watch('src/sass/**/*.scss', ['watch:trigger:scss']);
	gulp.watch('src/js/**/*.js', ['watch:trigger:js']);
	gulp.watch('src/*.html', ['watch:trigger:html']);
	gulp.watch(['src/**/*', '!src/sass/**/*.scss', '!src/js/**/*.js'], ['watch:trigger:other']);
});

gulp.task('watch:gulp', function () {
	var p;

	gulp.watch(['gulpfile.js', 'gulp/tasks/*.js'], spawnChildren);
	spawnChildren();

	function spawnChildren(e) {
		// kill previous spawned process
		if (p) {
			p.kill();
		}

		// `spawn` a child `gulp` process linked to the parent `stdio`
		p = spawn('gulp', [], {stdio: 'inherit'});
	}
});

gulp.task('watch:trigger:scss', function (cb) {
	runSequence('lint:scss', 'styles', 'serve:reload:css', cb);
});
gulp.task('watch:trigger:js', function (cb) {
	runSequence('lint:javascript', 'javascript', 'serve:reload:js', cb);
});
gulp.task('watch:trigger:html', function (cb) {
	runSequence('replace', 'serve:reload:html', cb);
});
gulp.task('watch:trigger:other', function (cb) {
	runSequence('copy', 'serve:reload:all', cb);
});
