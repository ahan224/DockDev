'use strict';
var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');

function handleErrors() {
 var args = Array.prototype.slice.call(arguments);
 notify.onError({
   title : 'Compile Error',
   message : '<%= error.message %>'
 }).apply(this, args);
 this.emit('end');
}

gulp.task('default', ['core', 'react', 'test', 'main', 'watch']);

gulp.task('core', () => {
  return gulp.src(['app/src/*.js', '!app/src/App.js', '!app/src/main.js'])
    .pipe(babel( {plugins: ['transform-es2015-modules-commonjs', 'transform-es2015-shorthand-properties']} ))
    .on('error', handleErrors)
    .pipe(gulp.dest('app/lib'));
});

gulp.task('main', () => {
  return gulp.src(['app/src/main.js'])
    .pipe(babel( {plugins: ['transform-es2015-modules-commonjs', 'transform-es2015-shorthand-properties']} ))
    .on('error', handleErrors)
    .pipe(gulp.dest('app/'));
});


gulp.task('react', () => {
  const bundler = browserify({
    entries: ['./app/src/App.js'],
    transform: babelify.configure({presets: ["react", "es2015"]}),
    debug: true,
    fullPaths: true
  })

  bundler.external('react');
  bundler.external('react-dom');
  bundler.external('./lib/utils.js');
  bundler.external('ramda');


  const watcher = watchify(bundler);

  return watcher
    .on('update', () => {
      watcher.bundle()
        .on('error', handleErrors)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('app/lib'))
    })
    .bundle()
    .on('error', handleErrors)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('app/lib'))
});

gulp.task('test', () => {
  return gulp.src('test/tests.js')
  .pipe(babel({plugins: ['transform-es2015-modules-commonjs', 'transform-es2015-shorthand-properties']}))
  .pipe(rename('tests-compiled.js'))
  .on('error', handleErrors)
  .pipe(gulp.dest('test/'));
});

gulp.task('watch', function() {
  gulp.watch(['app/src/*.js', '!app/src/App.js', '!app/src/main.js'], ['core']);
  gulp.watch('test/tests.js', ['test']);
  gulp.watch('app/src/main.js', ['main']);
});
