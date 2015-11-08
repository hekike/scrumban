'use strict'

const logger = require('winston')
const scrypt = require('scrypt')

const config = require('../../../../config/server')
const routesUtils = require('../../../utils/routes')
const schema = require('./schema').create
const User = require('../../../models/user')

const salt = new Buffer(config.password.secret)
const hashOpts = {
  N: 16384,
  r: 8,
  p: 1
}

/**
* Create user
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)

  logger.info('create user', body.data.email)

  // hash password
  const key = new Buffer(body.data.password)
  const password = yield scrypt.hash(key, hashOpts, 64, salt)

  body.data.password = password.toString('base64')

  // create user
  let user = new User(body.data)
  user = yield user.save()

  // do not send pw hash back
  user.password = undefined

  this.body = user
  this.status = 201
}
