'use strict'

const _ = require('lodash')

const Team = require('../../../models/team')
const thinky = require('../../../models/thinky')
const r = thinky.r

/**
* Team get
*/
module.exports = function *() {
  const userId = this.state.user.id
  const include = _.isString(this.query.include) ? this.query.include.split(',') : []
  const isIncludeBoards = include.indexOf('boards') > -1

  // user's teams
  let rawQuery = r
    .table('Team_User')
    .getAll(userId, { index: 'User_id' })
    .innerJoin(r.table('Team'), (teamUser, team) =>
      teamUser('Team_id').eq(team('id'))
    )
    .zip()
    .pluck('id', 'name')

  // include team'sboards
  if (isIncludeBoards) {
    rawQuery = rawQuery
      .merge(team => ({
        boards: r.table('Board')
          .getAll(team('id'), {
            index: 'teamId'
          })
          .pluck('id', 'name')
          .coerceTo('array')
      }))
  }

  const query = new thinky.Query(Team, rawQuery)
  const teams = yield query.run()

  this.body = teams.map(team => ({
    id: team.id,
    name: team.name,
    boards: isIncludeBoards ? team.boards : undefined
  }))
}
