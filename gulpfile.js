var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var connect = require("gulp-connect");



gulp.task('sass', function() {
    gulp.src('./sass/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:development', function() {
    gulp.src('./sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());
});


gulp.task('connect:html', function () {
  gulp.src('./**/*.html')
    .pipe(connect.reload());
});

gulp.task('connect:js', function () {
  gulp.src('./js/*.js')
    .pipe(connect.reload());
});

gulp.task('watch:all', function() {
    connect.server({
        root: './',
        livereload: true
    });
    gulp.watch(['./**/*.html','./sass/*.scss','./js/*.js'], ['sass:development','connect:html','connect:js']);
});

gulp.task('watch', ["watch:all"]);