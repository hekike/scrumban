'use strict'

const gulp = require('gulp')
const del = require('del')

const srcPath = [
  'dist/fonts/',
  'dist/style/',
  'dist/script/',
  'dist/index.html'
]

gulp.task('clean', function () {
  return del(srcPath)
})
