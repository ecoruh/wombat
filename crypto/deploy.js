var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('config-prod', function (cb) {
  exec('npm config set -g production true', function (err) {
    if (err) return cb(err);
    cb();
  });
});

gulp.task('install', ['config-prod'], function (cb) {
  exec('npm install', function (err) {
    if (err) return cb(err);
    cb();
  });
});

gulp.task('deploy', ['install'], function () {
  exec('sls deploy', function (err) {
    if (err) return cb(err);
    cb();
  });
});

gulp.task('config-dev', ['deploy'], function (cb) {
  exec('npm config set -g production false', function (err) {
    if (err) return cb(err);
    cb();
  });
});

gulp.task('default',
  [
    'config-prod', 
    'install', 
    'deploy', 
    'config-dev', 
    'install']);