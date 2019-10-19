const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const jsSrc = ['./src/index.js'];

const jsBuild = () => gulp
  .src(jsSrc)
  .pipe(babel({ presets: ['@babel/env'] }))
  .pipe(uglify({ toplevel: true }))
  .pipe(gulp.dest('./build/'));

const clean = () => del(['./build/*']);

// Tasks
gulp.task('convertJsForBuild', jsBuild);
gulp.task('clearDist', clean);

gulp.task('build', gulp.series('clearDist', 'convertJsForBuild'));
