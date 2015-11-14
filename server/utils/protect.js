'use strict'

const logger = require('winston')
const _ = require('lodash')

const Session = require('../models/session')
const Team = require('../models/team')
const config = require('../../config/server')

/**
 * @method user
 * @param {Generator} next
 */
function * user (next) {
  const cookieToken = this.cookies.get('sid')
  const headerToken = _.isString(this.headers.authorization)
    ? this.headers.authorization.substring(7) : undefined

  const token = cookieToken || headerToken

  if (!token) {
    this.throw(401, 'Authorization token is missing')
  }

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

  // protect teams
  if (this.params.teamId) {
    // check for team - user relation
    let isMember = yield Team.isMember(this.params.teamId, this.state.user.id)

    if (!isMember) {
      logger.warn(`board creation is forbidden for user: ${this.state.user.id} in team: ${this.params.teamId}`)
      // we don't want to user's to guess
      this.throw(404, 'team is not found or forbidden')
    }
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
