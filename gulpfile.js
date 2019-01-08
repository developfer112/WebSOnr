/*=========== GULP + Plugins init ==============*/


var gulp = require('gulp'),
	plumber = require('gulp-plumber'), // generates an error message
	prefixer = require('gulp-autoprefixer'), // automatically prefixes to css properties
	cssmin = require('gulp-cssmin'), // for minimizing css-files
	svgmin = require('gulp-svgmin'), // for minimizing svg-files
	rename = require('gulp-rename'), // to rename files
	sass = require('gulp-sass'), // for compiling scss-files to css
	browserSync = require('browser-sync'), // for online synchronization with the browser
	imagemin = require('gulp-imagemin'), // for minimizing images-files
	cache = require('gulp-cache'), // connecting the cache library
	htmlhint = require("gulp-htmlhint"), // for HTML-validation
	runSequence = require('run-sequence'); // for sequential execution of Gulp-tasks


/*=========== Compile SCSS ==============*/

gulp.task('sass', function() {

	gulp.src('html/sass/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(prefixer())
		.pipe(gulp.dest('./html/css'))
		.pipe(cssmin())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./html/css'))

        .pipe(browserSync.reload({
            stream: true
        }))
});



/*=========== Watch ==============*/

gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('html/sass/**/*.scss', ['sass']);
});


/*=========== ON-Line synchronization from browsers ==============*/

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        }
    })
});


/*=========== Minimization IMAGE ==============*/

gulp.task('images', function(){
    gulp.src('html/img/*')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('html/img'));
});

gulp.task('compress', function() {
	gulp.src('html/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('html/img'));
});


/*=========== Minimization SVG ==============*/

gulp.task('svg-min', function () {
	gulp.src('html/svg-icons/*.svg')
		.pipe(svgmin({
			plugins: [{
				removeDoctype: true
			}, {
				removeComments: true
			}, {
				cleanupNumericValues: {
					floatPrecision: 2
				}
			}, {
				convertColors: {
					names2hex: true,
					rgb2hex: true
				}
			}]
		}))
		.pipe(gulp.dest('html/svg-icons'));
});



/*============= HTML-validator ==============*/

gulp.task('html-valid', function() {
	gulp.src("html/*.html")
		.pipe(htmlhint());
});


/*============= Join tasks ==============*/

gulp.task('default', function(callback) {
	runSequence([ 'sass', 'browserSync', 'watch', 'images'],
		callback
	)
});

gulp.task('build', function(done) {
	runSequence('sass', 'html-valid', 'svg-min', 'images', 'compress', done);
});

