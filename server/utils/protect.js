'use strict'

const logger = require('winston')

const Session = require('../models/session')
const config = require('../../config/server')

/**
 * @method user
 * @param {Generator} next
 */
function * user (next) {
  const token = this.headers.authorization.substring(7)
  let session

  this.state.user = {
    token: token
  }

  // get session by token
  try {
    session = yield Session.get(token)
    this.state.user.id = session.uid
  } catch (err) {
    this.throw(401, 'Invalid token')
  }

  yield next

  // extend session after response if not logout endpoint
  if (this.path !== '/user/logout') {
    try {
      yield Session.extend(token, config.jwt.ttl)
    } catch (err) {
      // may token is already removed: because logout
      if (err.message === 'unknown token') {
        return
      }

      logger.error(err)

      this.throw(401, 'Invalid token')
    }
  }
}

module.exports = user
