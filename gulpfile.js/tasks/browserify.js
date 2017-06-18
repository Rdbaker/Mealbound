var config = require('../config.js').browserify;

var babelify = require('babelify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');


gulp.task('browserify', function() {
  // TODO: eventually uglify/minify in PRD
  return browserify(config.src)
    .transform(babelify, {presets: ["es2015", "react"]})
    .bundle()
    .pipe(source(config.inputName))
    .on('error', function(err) {console.log(err);})
    .pipe(gulp.dest(config.dest));
});
