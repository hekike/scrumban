'use strict'

const logger = require('winston')

const routesUtils = require('../../../utils/routes')
const schema = require('./schema').create
const User = require('../../../models/user')

/**
* Create user
*/
module.exports = function *() {
  const body = yield routesUtils.joiValidate(this, schema)

  logger.info('create user', body.data.email)

  // check for conflict
  const count = yield User
    .filter({
      email: body.data.email
    })
    .count()
    .execute()

  // conflict
  if (count > 0) {
    logger.silly('user\s email is reserved', body.data.email)
    this.throw(409, 'email address is reserved')
  }

  // create user
  let user = new User(body.data)
  yield user.hashPassword()
  user = yield user.save()

  // do not send pw hash back
  user.password = undefined

  this.body = user
  this.status = 201
}
