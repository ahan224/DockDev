'use strict';
var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');

// gulp.task('default',  () => {
//    return gulp.src("app/lib/components/**/*.js")
//    .pipe(babel({
//      presets: ['es2015']
//    }))
//    .pipe(gulp.dest('app/lib/build'));
//  });

gulp.task('default', () => {
  return gulp.src("app/src/**/*.js")
    .pipe(babel( {presets: ['react','es2015']} ))
    .pipe(gulp.dest('app/lib'));
});

gulp.task('react', () => {
	return gulp.src('app/src/components/*.js')
    // .pipe(watch('app/src/components/*.js'))
    .pipe(babel( {presets: ['react','es2015']} ))
		.pipe(gulp.dest('app/lib/components'));
});

gulp.task('test', () => {
  return gulp.src('test/tests.js')
  .pipe(babel( {presets: ['es2015']} ))
  .pipe(gulp.dest('test/lib'));
});

 // "scripts": {
 //   "start": "electron app/index.js",
 //   "babel:watch": "babel ./app/src -d ./app/lib --watch",
 //   "babel": "npm run babel:test & npm run babel:watch & babel:react",
 //   "test": "mocha \"./test/tests-compiled.js\""
 // },
