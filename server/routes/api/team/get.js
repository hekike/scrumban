'use strict'

const Team = require('../../../models/team')
const thinky = require('../../../models/thinky')
const r = thinky.r

/**
* Team get
*/
module.exports = function *() {
  const userId = this.state.user.id

  const rawQuery = r
    .table('Team_User')
    .getAll(userId, { index: 'User_id' })
    .innerJoin(r.table('Team'), (teamUser, team) =>
      teamUser('Team_id').eq(team('id'))
    )
    .zip()
    .pluck('id', 'name')

  const query = new thinky.Query(Team, rawQuery)
  const teams = yield query.run()

  this.body = teams.map(team => ({
    id: team.id,
    name: team.name
  }))
}
