'use strict'

const gulp = require('gulp')
const runSequence = require('run-sequence')
const requireDir = require('require-dir')
const config = require('./config/gulp')

requireDir('./task')

gulp.task('build', function (callback) {
  runSequence('clean', 'webpack', callback)
})

gulp.task('dev', function (callback) {
  config.isWatch = true

  runSequence('clean', ['webpack', 'server'], callback)
})

gulp.task('default', function () {
  gulp.start('build')
})
