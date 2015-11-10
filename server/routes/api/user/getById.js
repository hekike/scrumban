'use strict'

const User = require('../../../models/user')
const thinky = require('../../../models/thinky')
const Errors = thinky.Errors

/**
* Login user
*/
module.exports = function *() {
  const userId = this.state.user.id
  const routeUserId = this.params.userId

  // can get only me
  if (routeUserId !== 'me') {
    this.throw(401, 'unauthorized request')
  }

  // get user by email
  let user

  try {
    user = yield User
      .get(userId)
      .getView()
      .run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'user not found')
    }

    throw err
  }

  this.body = user
}
