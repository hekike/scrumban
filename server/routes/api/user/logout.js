'use strict'

const logger = require('winston')
const Session = require('../../../models/session')

/**
* Logout user
*/
module.exports = function *() {
  const userId = this.state.user.id
  const token = this.state.user.token

  logger.info('logout user', userId)

  // destroy token
  yield Session.destroy(token)

  this.cookies.set('sid', null, {
    httpOnly: true,
    signed: true,
    expires: new Date(0)
  })

  this.status = 204
}
