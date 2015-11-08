'use strict'

const logger = require('winston')
const config = {}

// logger
config.logger = {
  level: process.env.LOG_LEVEL || 'info'
}

// Config logger
logger.default.transports.console.colorize = true
logger.level = config.logger.level

// validate
if (!process.env.JWT_SECRET) {
  logger.warn('security vulnerability: JWT_SECRET is not defined')
}

if (!process.env.APP_KEYS) {
  logger.warn('security vulnerability: APP_KEYS is not defined')
}

// env
config.env = process.env.NODE_ENV
config.isTest = config.env === 'test'
config.isDev = config.env === 'development'

// server
config.ip = process.env.IP
config.port = process.env.PORT || 3000
config.host = process.env.HOST || 'http://localhost:3000'
config.appKeys = process.env.APP_KEYS ? process.env.APP_KEYS.split(',')
  : ['9GwPQCmnrd6vcc', 'bN6GbkM6XLVaEh']

// auth
config.jwt = {
  secret: process.env.JWT_SECRET || 'vroYaHLFcW6m6d',
  ttl: 60 * 60 // 1 hour
}

// satic
config.static = {
  maxAge: 86400000
}

// environment changes
if (config.isTest || config.isDev) {
  config.static.maxAge = 0
}

module.exports = config
