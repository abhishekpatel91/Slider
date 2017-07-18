/*Required Modeules*/
var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
    connect = require('gulp-connect-multi') ();

/*Gulp task to create server*/
gulp.task('connect', connect.server({
    root: ['source'],
    port: 8005,
    livereload: true,
    open: {}
}));

/*Gulp HTMl task*/
gulp.task('html', function() {
	gulp.src('source/*.html')
	.pipe(plumber())
	.pipe(connect.reload())
});

/*Gulp CSS task*/
gulp.task('css', function() {
	gulp.src('source/css/*.css')
	.pipe(plumber())
	.pipe(connect.reload())
});

/*Gulp JS task*/
gulp.task('script', function() {
	gulp.src('source/js/*.js')
	.pipe(plumber())
	.pipe(connect.reload())
});

/*Gulp task to watch html/scss/js*/
gulp.task('watch', function() {
	gulp.watch('source/js/*.js', ['script']);
	gulp.watch('source/css/*.css', ['css']);
	gulp.watch('source/*.html', ['html']);
});

/*Gulp default task*/
gulp.task('default', ['connect', 'watch']);