'use strict'

const thinky = require('./thinky')
const Team = require('./team')
const Board = require('./board')
const Column = require('./column')
const type = thinky.type
const r = thinky.r

const Card = thinky.createModel('Card', {
  id: type.string(),
  teamId: type.string().required(),
  boardId: type.string().required(),
  columnId: type.string().required(),
  name: type.string(),
  createdAt: type.date().default(r.now()),
  isRemoved: type.boolean().default(false),
  orderIndex: type.number()
})

Card.belongsTo(Team, 'team', 'teamId', 'id')
Team.hasMany(Card, 'cards', 'id', 'teamId')

Card.belongsTo(Board, 'board', 'boardId', 'id')
Board.hasMany(Card, 'cards', 'id', 'boardId')

Card.belongsTo(Column, 'column', 'columnId', 'id')
Column.hasMany(Card, 'cards', 'id', 'columnId')

Card.ensureIndex('orderIndex')

module.exports = Card
