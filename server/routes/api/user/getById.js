'use strict'

const _ = require('lodash')
const User = require('../../../models/user')
const thinky = require('../../../models/thinky')
const Errors = thinky.Errors

/**
* Login user
*/
module.exports = function *() {
  const userId = this.state.user.id
  const routeUserId = this.params.userId
  const include = _.isString(this.query.include) ? this.query.include.split(',') : []
  const isIncludeTeams = include.indexOf('teams') > -1

  // can get only me
  if (routeUserId !== 'me') {
    this.throw(401, 'unauthorized request')
  }

  // query
  let userQuery = User
    .get(userId)
    .getView()

  // include teams
  if (isIncludeTeams) {
    userQuery = userQuery.getJoin({
      teams: true
    })
  }

  // get user by email
  let user

  try {
    user = yield userQuery.run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'user not found')
    }

    throw err
  }

  this.body = user
}
