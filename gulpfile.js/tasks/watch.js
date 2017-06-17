var gulp = require('gulp');
var config = require('../config.js');


gulp.task('watch', function() {
  gulp.watch(config.src + 'sass/**/*', ['sass']);
  gulp.watch(config.src + 'js/**/*', ['build']);
});
