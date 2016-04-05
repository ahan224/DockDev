/*eslint-disable */
var gulp = require('gulp');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var watch = require('gulp-watch');
var babel = require('gulp-babel');

function handleErrors() {
 var args = Array.prototype.slice.call(arguments);
 notify.onError({
   title : 'Compile Error',
   message : '<%= error.message %>'
 }).apply(this, args);
 this.emit('end');
}

gulp.task('default', ['server', 'react', 'main', 'client-other', 'html', 'bower', 'watch']);

gulp.task('server', () => {
  return gulp.src('./app/src/server/**/**')
    .pipe(babel( {plugins: [
        'transform-es2015-modules-commonjs',
        'transform-es2015-shorthand-properties',
        'transform-es2015-parameters'
      ]}
    ))
    .on('error', handleErrors)
    .pipe(gulp.dest('./app/build/server'));
});

gulp.task('main', () => {
  return gulp.src('./app/src/main.js')
    .pipe(babel( {plugins: ['transform-es2015-modules-commonjs', 'transform-es2015-shorthand-properties']} ))
    .on('error', handleErrors)
    .pipe(gulp.dest('./app/build'));
});


gulp.task('react', () => {

  const bundler = browserify({
    entries: ['./app/src/client/index.js'],
    transform: babelify.configure({presets: ["react", "es2015"]}),
    debug: true,
    fullPaths: true
  })

  bundler.external([
    'react',
    'react-dom',
    'ramda',
    'react-router',
    'electron',
    './server/main',
  ]);

  return bundler
    .bundle()
    .on('error', handleErrors)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./app/build/client'))
});

gulp.task('client-other', () => {
  return gulp.src(['./app/src/client/*/**', '!./app/src/client/index.js', '!./app/src/client/components/**/**.js'])
    .pipe(gulp.dest('./app/build/client/'))
})

gulp.task('images', () => {
  return gulp.src('./app/src/client/images/*')
    .pipe(gulp.dest('./app/build/client/images'))
})

gulp.task('html', () => {
  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./app/build'))
})

gulp.task('bower', () => {
  return gulp.src('./bower_components/*/**')
    .pipe(gulp.dest('./app/build/client/bower_components'))
})

gulp.task('watch', function() {
  gulp.watch(['./app/src/server/**/**',], ['server']);
  gulp.watch('./app/src/main.js', ['main']);
  gulp.watch(['./app/src/client/index.js', 'app/src/client/components/**/**'], ['react']);
  gulp.watch('./app/src/client/*/**', ['client-other']);
  gulp.watch('./app/index.html', ['html']);
  gulp.watch('./bower_components/*/**', ['bower']);
});
