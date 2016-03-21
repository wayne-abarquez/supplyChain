'use strict';

var gulp = require('gulp');

var src = 'src/';
var appSrc = src + 'app/';
var tmp = src + 'tmp/';

gulp.paths = {
    src: src,
    
    bower: src + 'bower_modules/',

    srcIndex: appSrc + 'views/index.html',
    srcViews: appSrc + 'views/',
    
    srcImages: appSrc + 'images/',
    srcSass: appSrc + 'sass/',
    srcCss: appSrc + 'css/',
    srcJs: appSrc + 'js/',
    srcLibJs: appSrc + 'lib_js/',

    destClient: './',
    destImages: 'images/',
    destFontawesome: 'font-awesome/',
    destFonts: 'fonts/',
    destCss: 'css/',
    destJs: 'js/'

};

require('require-dir')('./gulp');

gulp.task('build', ['clean'], function () {
    gulp.start('buildapp');
});