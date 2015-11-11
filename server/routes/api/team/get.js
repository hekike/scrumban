'use strict'

const User = require('../../../models/user')

/**
* Team get
*/
module.exports = function *() {
  const userId = this.state.user.id

  // get user's teams
  const user = yield User
    .get(userId)
    .getJoin({
      teams: true
    })
    .getView()
    .run()

  this.body = user.teams
}
