'use strict';

var gulp = require('gulp');
var paths = gulp.paths;
var $ = require('gulp-load-plugins')();

gulp.task('sass', function () {
    return gulp.src(paths.srcSass + 'app.scss')
        .pipe($.plumber())
        .pipe($.sass({style: 'expanded'}))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']}))
        .pipe($.csso())
        .pipe($.rename('app.min.css'))
        .pipe(gulp.dest(paths.destCss))
    ;
});

 gulp.task('vendor-css', function () {
    return gulp.src([
        paths.bower + 'bootstrap/dist/css/bootstrap.min.css',
        paths.bower + 'font-awesome/css/font-awesome.css'
    ])
        .pipe($.concat('vendor.min.css'))
        .pipe($.csso())
        .pipe(gulp.dest(paths.destCss));
 });

gulp.task('styles', ['sass', 'vendor-css']);