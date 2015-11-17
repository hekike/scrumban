'use strict'

const Team = require('../../../models/team')
const thinky = require('../../../models/thinky')
const Errors = thinky.Errors

/**
* Team by id
*/
module.exports = function *() {
  const routeTeamId = this.params.teamId
  let team

  // query
  let query = Team
    .get(routeTeamId)

  try {
    team = yield query.run()
  } catch (err) {
    if (err instanceof Errors.DocumentNotFound) {
      this.throw(404, 'team not found')
    }

    throw err
  }

  this.body = team
}
