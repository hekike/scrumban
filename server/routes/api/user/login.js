'use strict'

const logger = require('winston')
const moment = require('moment')

const config = require('../../../../config/server')
const routesUtils = require('../../../utils/routes')
const schema = require('./schema').login
const User = require('../../../models/user')
const Session = require('../../../models/session')
const thinky = require('../../../models/thinky')
const Errors = thinky.Errors

/**
* Login user
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)

  logger.info('login user', body.data.email)

  // get user by email
  let user

  try {
    user = yield User
      .filter({
        email: body.data.email
      })
      .uniqueResult()
      .run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      // invalid email
      logger.silly('login user not found', body.data.email)
      this.throw(401, 'invalid email or password')
    }

    throw err
  }

  // invalid password
  const isEqual = yield user.isPasswordEqual(body.data.password)

  if (!isEqual) {
    logger.silly('login user invalid password', body.data.email)
    this.throw(401, 'invalid email or password')
  }

  user.password = undefined

  // create token
  const token = yield Session.create({
    uid: user.id,
    ttl: config.jwt.ttl
  })

  // create session cookie with token
  const expires = moment().add(config.jwt.ttl, 's').toDate()

  this.cookies.set('sid', token, {
    httpOnly: true,
    signed: true,
    expires: expires
  })

  this.body = user
}
