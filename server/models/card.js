'use strict'

const thinky = require('./thinky')
const Board = require('./board')
const Column = require('./column')
const type = thinky.type
const r = thinky.r

const Card = thinky.createModel('Card', {
  id: type.string(),
  boardId: type.string(),
  columnId: type.string(),
  name: type.string(),
  createdAt: type.date().default(r.now()),
  isRemoved: type.boolean().default(false),
  orderIndex: type.number()
})

Card.belongsTo(Board, 'board', 'boardId', 'id')
Board.hasMany(Card, 'cards', 'id', 'boardId')

Card.belongsTo(Column, 'column', 'columnId', 'id')
Column.hasMany(Card, 'cards', 'id', 'columnId')

Card.ensureIndex('orderIndex')

module.exports = Card
