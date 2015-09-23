var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var connect = require("gulp-connect");
var minifyHTML = require('gulp-minify-html');
var gulpCopy = require('gulp-copy');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var inline = require('gulp-inline');
var gzip = require('gulp-gzip');
var tar = require('gulp-tar');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var open = require('gulp-open');

var templateCacheBootstrap = "firstapp.run(['$templateCache', function($templateCache) {";



gulp.task('clean:production', function () {
    return gulp.src('./production', {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean:tmp', function () {
    return gulp.src('./tmp', {
            read: false
        })
        .pipe(clean());
});


gulp.task('clean:w', function () {
    return gulp.src('./w', {
            read: false
        })
        .pipe(clean());
});

gulp.task('minify:css', function () {
    return gulp.src('./w/*.css')
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('./w/'));
});

gulp.task('gzipfile', function () {
    gulp.src('./w/index.html')
        .pipe(gzip({
            preExtension: 'gz'
        }))
        .pipe(gulp.dest('./production/'));
});

gulp.task('tarball', function () {
    gulp.src('./production/**')
        .pipe(tar('production.tar'))
        .pipe(gulp.dest('./'));
});

gulp.task('inlinesource', function () {
    return gulp.src('./w/index.html')
        .pipe(inline({
            base: './w/',
            disabledTypes: ['svg', 'img'] // Only inline css files 
        }))
        .pipe(gulp.dest('./w/'));
});



gulp.task('uglify:js', function () {
    return gulp.src('./w/w.js')
        .pipe(uglify())
        .pipe(gulp.dest('./w'));
});

gulp.task('concat:js', function () {
    return gulp.src(['./js/app.js',
                     './js/controller.js',
                     './js/templateservice.js',
                     './js/navigation.js',
                     './w/js/templates.js'])
        .pipe(concat('w.js'))
        .pipe(gulp.dest('./w'));
});

gulp.task('templatecache', function () {
    return gulp.src('./w/views/**/*.html')
        .pipe(templateCache({
            templateHeader: templateCacheBootstrap
        }))
        .pipe(gulp.dest('./w/js/'));
});


gulp.task('copy:img', function () {
    return gulp.src("./img/**")
        .pipe(gulpCopy("./production/"));
});

gulp.task('copy:fonts', function () {
    return gulp.src("./fonts/**")
        .pipe(gulpCopy("./production/"));
});


gulp.task('sass:production', function () {
    gulp.src('./sass/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./w'));
});

gulp.task('sass:development', function () {
    gulp.src('./sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());
});
gulp.task('minify:indexproduction', function () {
    var opts = {
        conditionals: true,
        spare: true
    };
    return gulp.src('./indexproduction.html')
        .pipe(minifyHTML(opts))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./w/'));
});
gulp.task('minify:views', function () {
    var opts = {
        conditionals: true,
        spare: true
    };

    return gulp.src('./views/**/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./w/views/'));
});
gulp.task('connect:html', function () {
    gulp.src('./**/*.html')
        .pipe(connect.reload());
});
gulp.task('connect:js', function () {
    gulp.src('./js/*.js')
        .pipe(connect.reload());
});
gulp.task('watch:all', function () {
    connect.server({
        root: './',
        livereload: true
    });
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:8080'
        }));
    gulp.watch(['./**/*.html', './sass/*.scss', './js/*.js'], ['sass:development', 'connect:html', 'connect:js']);
});


gulp.task('watch', ["watch:all"]);
gulp.task('default', ["watch:all"]);
gulp.task('development', ["watch:all"]);
gulp.task('minifyhtml', ["minify:indexHTML", "minify:views", "templatecache"]);
gulp.task('copy', ["copy:img", "copy:fonts"]);

gulp.task('production', function () {
    runSequence(["copy:img", "copy:fonts", "sass:production", "minify:indexproduction", "minify:views"], "clean:tmp", ["minify:css", "templatecache"], "clean:tmp", "concat:js", "clean:tmp", "uglify:js", "clean:tmp", "inlinesource", "clean:tmp", "gzipfile", "clean:tmp", 'clean:w', "tarball", "clean:tmp", 'clean:w', 'clean:production');
});