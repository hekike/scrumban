'use strict'

const gulp = require('gulp')
const gutil = require('gulp-util')
const webpack = require('webpack')

const webpackConfig = require('../config/webpack')
const config = require('../config/gulp')

gulp.task('webpack', function (callback) {
  if (config.isWatch) {
    webpackConfig.watch = true
  }

  webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }

    gutil.log('[webpack]', stats.toString())

    if (!config.isWatch) {
      callback()
    }
  })
})
