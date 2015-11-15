'use strict'

const path = require('path')
const gutil = require('gulp-util')
const config = {}

config.isProduction = !!gutil.env.production
config.isWatch = false
config.port = process.env.PORT || 8080
config.path = {
  server: path.resolve('./server')
}

module.exports = config
