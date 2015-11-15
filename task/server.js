'use strict'

const path = require('path')
const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const config = require('../config/gulp')

gulp.task('server', function () {
  return nodemon({
    script: path.join(config.path.server, 'server.js'),
    ext: 'js',
    watch: path.join(config.path.server)
  })
})
