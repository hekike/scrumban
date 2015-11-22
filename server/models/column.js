'use strict'

const thinky = require('./thinky')
const Team = require('./team')
const Board = require('./board')
const type = thinky.type
const r = thinky.r

const Column = thinky.createModel('Column', {
  id: type.string(),
  teamId: type.string().required(),
  boardId: type.string().required(),
  name: type.string(),
  createdAt: type.date().default(r.now()),
  isRemoved: type.boolean().default(false),
  orderIndex: type.number()
})

Column.belongsTo(Team, 'team', 'teamId', 'id')
Team.hasMany(Column, 'columns', 'id', 'teamId')

Column.belongsTo(Board, 'board', 'boardId', 'id')
Board.hasMany(Column, 'columns', 'id', 'boardId')

Column.ensureIndex('orderIndex')

module.exports = Column
