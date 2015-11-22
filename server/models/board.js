'use strict'

const thinky = require('./thinky')
const Team = require('./team')
const type = thinky.type
const r = thinky.r

const Board = thinky.createModel('Board', {
  id: type.string(),
  teamId: type.string().required(),
  name: type.string(),
  createdAt: type.date().default(r.now())
})

Board.belongsTo(Team, 'team', 'teamId', 'id')
Team.hasMany(Board, 'teams', 'id', 'teamId')

module.exports = Board
