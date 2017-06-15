var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('build', function (cb) {
  // build webapp
  exec('npm run --prefix web build', function(err) {
    if (err) return cb(err);
    cb();
  });
});

gulp.task('app', ['build'], function () {
  return gulp.src('web/build/**/*.*')
    .pipe(gulp.dest('app'))
});

gulp.task('s3', ['build', 'app'], function (cb) {
  exec('sls syncToS3', function(err) {
    if (err) return cb(err);
    cb();
  });
});

gulp.task('default', ['build', 'app', 's3']);